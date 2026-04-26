import { type Request, type Response, type NextFunction } from "express";
import { 
  type CreateServiceRequestDTO, 
  type UpdateServiceRequestDTO, 
  type ServiceResponseDTO 
} from "../dtos/ServiceDTO.js";
import {
  getAllServicesUseCase,
  getServiceByIdUseCase,
  createServiceUseCase,
  updateServiceUseCase,
  deleteServiceUseCase,
} from "../useCases/index.js";
import { type ServiceUCOutput } from "../useCases/types/IServiceUseCases.js";

const mapToDTO = (service: ServiceUCOutput): ServiceResponseDTO => ({
  _id: service.id,
  MaDV: service.code,
  TenDV: service.name,
  DonGia: service.price,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
});

const serviceController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllServicesUseCase.execute();
      res.json(result.map(mapToDTO));
    } catch (error) {
      next(error);
    }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getServiceByIdUseCase.execute({ id: req.params.id as string });
      res.json(mapToDTO(result));
    } catch (error) {
      next(error);
    }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateServiceRequestDTO;
      const result = await createServiceUseCase.execute({
        code: body.MaDV,
        name: body.TenDV,
        price: body.DonGia,
      });
      res.status(201).json(mapToDTO(result));
    } catch (error) {
      next(error);
    }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as UpdateServiceRequestDTO;
      const result = await updateServiceUseCase.execute({
        id: req.params.id as string,
        name: body.TenDV,
        price: body.DonGia,
      });
      res.json(mapToDTO(result));
    } catch (error) {
      next(error);
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteServiceUseCase.execute({ id: req.params.id as string });
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
};

export default serviceController;
