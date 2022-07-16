type NonNullable<T> = Exclude<T, null | undefined>;
export type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};
export type NotNullable<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
