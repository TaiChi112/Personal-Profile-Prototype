export type SortDirection = 'asc' | 'desc';

export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface ISortOptions<T> {
  field: keyof T;
  direction: SortDirection;
}

export interface IFindOptions<T> {
  where?: Partial<T>;
  orderBy?: ISortOptions<T>;
  pagination?: IPaginationOptions;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Base read-only repository interface
 */
export interface IReadRepository<T, ID = string | number> {
  findById(id: ID): Promise<T | null>;
  findOne(options: Omit<IFindOptions<T>, 'pagination'>): Promise<T | null>;
  findMany(options?: IFindOptions<T>): Promise<T[]>;
  findAndCountAll(options?: IFindOptions<T>): Promise<IPaginatedResult<T>>;
  count(options?: Pick<IFindOptions<T>, 'where'>): Promise<number>;
}

/**
 * Base write-only repository interface
 */
export interface IWriteRepository<T, ID = string | number> {
  create(data: Partial<T> | Omit<T, 'id'>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

/**
 * Full repository interface combining read and write operations
 */
export interface IRepository<T, ID = string | number> 
  extends IReadRepository<T, ID>, IWriteRepository<T, ID> {}

/**
 * Event-sourced aggregate repository interface
 */
export interface IEventSourcedRepository<TAggregate, TEvent> {
  /**
   * Saves new events for a specific aggregate.
   * @param aggregateId The ID of the aggregate
   * @param events The new events to append
   * @param expectedVersion For optimistic concurrency control
   */
  save(aggregateId: string, events: TEvent[], expectedVersion?: number): Promise<void>;
  
  /**
   * Loads an aggregate by reconstructing it from its event stream.
   * @param aggregateId The ID of the aggregate
   */
  load(aggregateId: string): Promise<TAggregate | null>;
}
