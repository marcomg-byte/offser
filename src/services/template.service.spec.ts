import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PathLike, existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  TemplateCompileError as TemplateCompileErrorClass,
  TemplatePreloadError as TemplatePreloadErrorClass,
} from '../errors/index.js';

vi.mock('fs');
vi.mock('../config/env.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('template.service', () => {
  const templatesDir = path.resolve(__dirname, '../templates');
  const templateName = 'test-template';
  const templateFilename = `${templateName}.hbs`;
  const templatePath = path.join(templatesDir, templateFilename);
  const templateSource = '<p>Hello, {{name}}!</p>';
  const templateData = { name: 'World' };
  const expectedHtml = '<p>Hello, World!</p>';

  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  describe('compileTemplate', () => {
    describe('in development mode (no caching)', () => {
      let compileTemplate: (
        templateName: string,
        data: Record<string, unknown>,
      ) => string;

      let TemplateCompileError: typeof TemplateCompileErrorClass;

      beforeEach(async () => {
        vi.doMock('../config/env.js', () => ({
          env: { NODE_ENV: 'DEVELOPMENT' },
        }));
        const module = await import('./index.js');
        const errorsModule = await import('../errors/index.js');
        TemplateCompileError = errorsModule.TemplateCompileError;
        compileTemplate = module.compileTemplate;
      });

      it('should compile a template from the file system', () => {
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(templateSource);

        const result = compileTemplate(templateName, templateData);

        expect(result).toBe(expectedHtml);
        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
      });

      it('should re-read the template file on each call', () => {
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(templateSource);

        compileTemplate(templateName, templateData);
        compileTemplate(templateName, templateData);

        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
        expect(existsSync).toHaveBeenCalledTimes(2);
        expect(readFileSync).toHaveBeenCalledTimes(2);
      });

      it('should throw TemplateCompileError if the template file does not exist', () => {
        vi.mocked(existsSync).mockReturnValue(false);

        expect(() => compileTemplate(templateName, templateData)).toThrow(
          new TemplateCompileError(
            templateName,
            templateData,
            new Error(
              `Template "${templateName}" not found at path: ${templatePath}`,
            ),
          ),
        );
        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(existsSync).toHaveBeenCalledTimes(1);
        expect(readFileSync).not.toHaveBeenCalled();
      });

      it('should throw TemplateCompileError on file read error', () => {
        const readError = new Error('Read error');
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockImplementation(() => {
          throw readError;
        });

        expect(() => compileTemplate(templateName, templateData)).toThrow(
          new TemplateCompileError(templateName, templateData, readError),
        );
        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(existsSync).toHaveBeenCalledTimes(1);
        expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
        expect(readFileSync).toHaveBeenCalledTimes(1);
      });
    });

    describe('in production mode (with caching)', () => {
      let compileTemplate: (
        templateName: string,
        data: Record<string, unknown>,
      ) => string;
      let TemplateCompileError: typeof TemplateCompileErrorClass;

      beforeEach(async () => {
        vi.doMock('../config/env.js', () => ({
          env: { NODE_ENV: 'PRODUCTION' },
        }));
        const module = await import('./index.js');
        const errorsModule = await import('../errors/index.js');
        compileTemplate = module.compileTemplate;
        TemplateCompileError = errorsModule.TemplateCompileError;
      });

      it('should compile and cache the template on first call', () => {
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(templateSource);

        const result = compileTemplate(templateName, templateData);
        expect(result).toBe(expectedHtml);
        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
      });

      it('should use the cached template on subsequent calls', () => {
        vi.mocked(existsSync).mockReturnValue(true);
        vi.mocked(readFileSync).mockReturnValue(templateSource);

        compileTemplate(templateName, templateData);
        const result = compileTemplate(templateName, templateData);

        expect(result).toBe(expectedHtml);
        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(existsSync).toHaveBeenCalledTimes(1);
        expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
        expect(readFileSync).toHaveBeenCalledTimes(1);
      });

      it('should throw TemplateCompileError if template is not cached and file does not exist', () => {
        vi.mocked(existsSync).mockReturnValue(false);

        expect(() => compileTemplate(templateName, templateData)).toThrow(
          new TemplateCompileError(
            templateName,
            templateData,
            new Error(
              `Template "${templateName}" not found at path: ${templatePath}`,
            ),
          ),
        );
        expect(existsSync).toHaveBeenCalledWith(templatePath);
        expect(existsSync).toHaveBeenCalledTimes(1);
        expect(readFileSync).not.toHaveBeenCalled();
      });
    });
  });

  describe('clearTemplateCache', () => {
    let compileTemplate: (
      templateName: string,
      data: Record<string, unknown>,
    ) => string;
    let clearTemplateCache: () => void;

    beforeEach(async () => {
      vi.doMock('../config/env.js', () => ({
        env: { NODE_ENV: 'PRODUCTION' },
      }));
      const module = await import('./index.js');
      compileTemplate = module.compileTemplate;
      clearTemplateCache = module.clearTemplateCache;
    });

    it('should clear the template cache', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(templateSource);

      compileTemplate(templateName, templateData);
      expect(existsSync).toHaveBeenCalledWith(templatePath);
      expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
      expect(existsSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledTimes(1);

      clearTemplateCache();

      compileTemplate(templateName, templateData);
      expect(existsSync).toHaveBeenCalledWith(templatePath);
      expect(readFileSync).toHaveBeenCalledWith(templatePath, 'utf-8');
      expect(existsSync).toHaveBeenCalledTimes(2);
      expect(readFileSync).toHaveBeenCalledTimes(2);
    });
  });

  describe('preloadTemplates', () => {
    let preloadTemplates: () => number;
    let TemplatePreloadError: typeof TemplatePreloadErrorClass;
    let readdirSync: (path: PathLike) => string[];

    beforeEach(async () => {
      vi.doMock('../config/env.js', () => ({
        env: { NODE_ENV: 'PRODUCTION' },
      }));
      const module = await import('./index.js');
      preloadTemplates = module.preloadTemplates;
      const fsmodule = await import('fs');
      readdirSync = fsmodule.readdirSync;
      const errorsModule = await import('../errors/index.js');
      TemplatePreloadError = errorsModule.TemplatePreloadError;
    });

    it('should load and compile all templates from the directory', () => {
      const templateFiles = ['template1.hbs', 'template2.hbs'];
      vi.mocked(readdirSync).mockReturnValue(templateFiles);
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockReturnValue(templateSource);

      const count = preloadTemplates();

      expect(count).toBe(2);
      expect(readdirSync).toHaveBeenCalledWith(templatesDir);
      expect(readdirSync).toHaveBeenCalledTimes(1);
      templateFiles.forEach((file) => {
        const filePath = path.join(templatesDir, file);
        expect(existsSync).toHaveBeenCalledWith(filePath);
        expect(readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
      });
      expect(existsSync).toHaveBeenCalledTimes(templateFiles.length);
      expect(readFileSync).toHaveBeenCalledTimes(templateFiles.length);
    });

    it('should throw TemplatePreloadError if readdirSync fails', () => {
      const dirError = new Error('Directory not found');

      vi.mocked(readdirSync).mockImplementation(() => {
        throw dirError;
      });

      expect(() => preloadTemplates()).toThrow(
        new TemplatePreloadError(dirError),
      );
      expect(readdirSync).toHaveBeenCalledWith(templatesDir);
      expect(readdirSync).toHaveBeenCalledTimes(1);
    });

    it('should throw TemplatePreloadError if readFileSync fails', () => {
      const templateFiles = ['template1.hbs'];
      const fileError = new Error('File read error');

      vi.mocked(readdirSync).mockReturnValue(templateFiles);
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(readFileSync).mockImplementation(() => {
        throw fileError;
      });

      expect(() => preloadTemplates()).toThrow(
        new TemplatePreloadError(fileError),
      );

      expect(readdirSync).toHaveBeenCalledWith(templatesDir);
      expect(readdirSync).toHaveBeenCalledTimes(1);

      templateFiles.forEach((file) => {
        const filePath = path.join(templatesDir, file);
        expect(existsSync).toHaveBeenCalledWith(filePath);
        expect(readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
      });
    });
  });
});
