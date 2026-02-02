import { Request, Response, NextFunction } from 'express';
import { compileTemplate } from '../services/index.js';
import {
  renderTemplateParamsSchema,
  salesTemplateSchema,
  offersTemplateSchema,
  shipmentTemplateSchema,
} from '../schemas/index.js';

const templateHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const paramsData = renderTemplateParamsSchema.parse(req.params);
    const { templateName } = paramsData;
    let bodyData: Record<string, unknown>;

    if (templateName === 'sales') {
      bodyData = salesTemplateSchema.parse(req.body);
    } else if (templateName === 'offers') {
      bodyData = offersTemplateSchema.parse(req.body);
    } else if (templateName === 'shipment') {
      bodyData = shipmentTemplateSchema.parse(req.body);
    } else {
      bodyData = {};
    }

    const html = compileTemplate(templateName, bodyData);
    console.log(`✅ Template "${templateName}" rendered successfully.`);
    console.log(
      html.slice(0, 300) + (html.length > 300 ? '... [truncated]' : ''),
    );
    return res.status(200).send(html);
  } catch (error: unknown) {
    return next(error);
  }
};

export { templateHandler };
