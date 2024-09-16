export type RepositoryFindOptions = {
  includeRemoved?: boolean;
  limit?: number;
  offset?: number;
};

export type RepositoryRemoveOptions = {
  disableSoftDeleting?: boolean;
};
