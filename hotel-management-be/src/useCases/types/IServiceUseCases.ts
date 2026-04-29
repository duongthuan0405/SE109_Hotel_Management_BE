import { type IUseCase } from "./IUseCase.js";
import { type Service } from "../../models/Service.js";

export type ServiceUCOutput = Service;

// 1. GetAllServices
export type IGetAllServicesUseCase = IUseCase<void, ServiceUCOutput[]>;

// 2. GetServiceById
export type IGetServiceByIdUseCase = IUseCase<{ id: string }, ServiceUCOutput>;

// 3. CreateService
export type CreateServiceUCInput = {
  name: string;
  price: number;
};
export type ICreateServiceUseCase = IUseCase<CreateServiceUCInput, ServiceUCOutput>;

// 4. UpdateService
export type UpdateServiceUCInput = {
  id: string;
  name?: string | undefined;
  price?: number | undefined;
};
export type IUpdateServiceUseCase = IUseCase<UpdateServiceUCInput, ServiceUCOutput>;

// 5. DeleteService
export type IDeleteServiceUseCase = IUseCase<{ id: string }, boolean>;
