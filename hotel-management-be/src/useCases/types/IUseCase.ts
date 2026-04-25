export type IUseCase<TInput, TOutput> = {
  execute(input: TInput): Promise<TOutput>;
};
