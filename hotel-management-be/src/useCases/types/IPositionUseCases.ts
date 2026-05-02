import type { Position } from "../../models/Position.js";
import type { IUseCase } from "./IUseCase.js";

export type PositionUCOutput = Position;

export type IGetAllPositionsUseCase = IUseCase<void, PositionUCOutput[]>;

export type IGetPositionByIdUseCase = IUseCase<string, PositionUCOutput | null>;

export type CreatePositionUCInput = {
  code: string;
  name: string;
};
export type ICreatePositionUseCase = IUseCase<CreatePositionUCInput, PositionUCOutput>;

export type UpdatePositionUCInput = {
  id: string;
  name: string;
};
export type IUpdatePositionUseCase = IUseCase<UpdatePositionUCInput, PositionUCOutput | null>;

export type IDeletePositionUseCase = IUseCase<string, boolean>;
