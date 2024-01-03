import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AccountInfo = {
  __typename?: 'AccountInfo';
  accountHolder: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
};

export type Admin = {
  __typename?: 'Admin';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  loginId: Scalars['String']['output'];
  state: AdminState;
};

export type AdminOrderByWithRelationInput = {
  createdAt?: InputMaybe<SortOrder>;
  createdToken?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  loginId?: InputMaybe<SortOrder>;
  password?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  state?: InputMaybe<SortOrder>;
  token?: InputMaybe<SortOrder>;
};

export enum AdminState {
  Active = 'ACTIVE',
  Deleted = 'DELETED'
}

export type AdminWhereInput = {
  AND?: InputMaybe<Array<AdminWhereInput>>;
  NOT?: InputMaybe<Array<AdminWhereInput>>;
  OR?: InputMaybe<Array<AdminWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdToken?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<IntFilter>;
  loginId?: InputMaybe<StringFilter>;
  password?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  state?: InputMaybe<EnumAdminStateFilter>;
  token?: InputMaybe<StringNullableFilter>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type BoolNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableFilter>;
};

export type CategoryChangeInput = {
  new: Scalars['String']['input'];
  old: Scalars['String']['input'];
};

export type CategoryCreateInput = {
  code: Scalars['String']['input'];
  depth1: Scalars['String']['input'];
  depth2: Scalars['String']['input'];
  depth3: Scalars['String']['input'];
  depth4: Scalars['String']['input'];
  depth5: Scalars['String']['input'];
  depth6: Scalars['String']['input'];
  name: Scalars['String']['input'];
  sillCode: Scalars['String']['input'];
};

export type CategoryInfoA001 = {
  __typename?: 'CategoryInfoA001';
  activeSillDataA001: Array<SillInfoA001>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA001: SillInfoA001;
};


export type CategoryInfoA001ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA001ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA001WhereInput>;
  none?: InputMaybe<CategoryInfoA001WhereInput>;
  some?: InputMaybe<CategoryInfoA001WhereInput>;
};

export type CategoryInfoA001OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA001OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA001?: InputMaybe<SillInfoA001OrderByWithRelationInput>;
};

export type CategoryInfoA001Type = {
  __typename?: 'CategoryInfoA001Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA001WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA001WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA001WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA001WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA001?: InputMaybe<SillInfoA001WhereInput>;
};

export type CategoryInfoA006 = {
  __typename?: 'CategoryInfoA006';
  activeSillDataA006: Array<SillInfoA006>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA006: SillInfoA006;
};


export type CategoryInfoA006ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA006ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA006WhereInput>;
  none?: InputMaybe<CategoryInfoA006WhereInput>;
  some?: InputMaybe<CategoryInfoA006WhereInput>;
};

export type CategoryInfoA006OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA006OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA006?: InputMaybe<SillInfoA006OrderByWithRelationInput>;
};

export type CategoryInfoA006Type = {
  __typename?: 'CategoryInfoA006Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA006WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA006WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA006WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA006WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA006?: InputMaybe<SillInfoA006WhereInput>;
};

export type CategoryInfoA027 = {
  __typename?: 'CategoryInfoA027';
  activeSillDataA027: Array<SillInfoA027>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA027: SillInfoA027;
};


export type CategoryInfoA027ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA027ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA027WhereInput>;
  none?: InputMaybe<CategoryInfoA027WhereInput>;
  some?: InputMaybe<CategoryInfoA027WhereInput>;
};

export type CategoryInfoA027OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA027OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA027?: InputMaybe<SillInfoA027OrderByWithRelationInput>;
};

export type CategoryInfoA027Type = {
  __typename?: 'CategoryInfoA027Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA027WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA027WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA027WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA027WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA027?: InputMaybe<SillInfoA027WhereInput>;
};

export type CategoryInfoA077 = {
  __typename?: 'CategoryInfoA077';
  activeSillDataA077: Array<SillInfoA077>;
  categoryInfoA001: CategoryInfoA001;
  categoryInfoA006: CategoryInfoA006;
  categoryInfoA027: CategoryInfoA027;
  categoryInfoA112: CategoryInfoA112;
  categoryInfoA113: CategoryInfoA113;
  categoryInfoA524: CategoryInfoA524;
  categoryInfoA525: CategoryInfoA525;
  categoryInfoB378: CategoryInfoB378;
  categoryInfoB719: CategoryInfoB719;
  categoryInfoB956: CategoryInfoB956;
  code: Scalars['String']['output'];
  codeA001: Scalars['String']['output'];
  codeA006: Scalars['String']['output'];
  codeA027: Scalars['String']['output'];
  codeA112: Scalars['String']['output'];
  codeA113: Scalars['String']['output'];
  codeA524: Scalars['String']['output'];
  codeA525: Scalars['String']['output'];
  codeB378: Scalars['String']['output'];
  codeB719: Scalars['String']['output'];
  codeB956: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA077: SillInfoA077;
};


export type CategoryInfoA077ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA077ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA077WhereInput>;
  none?: InputMaybe<CategoryInfoA077WhereInput>;
  some?: InputMaybe<CategoryInfoA077WhereInput>;
};

export type CategoryInfoA077OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA077OrderByWithRelationInput = {
  categoryInfoA001?: InputMaybe<CategoryInfoA001OrderByWithRelationInput>;
  categoryInfoA006?: InputMaybe<CategoryInfoA006OrderByWithRelationInput>;
  categoryInfoA027?: InputMaybe<CategoryInfoA027OrderByWithRelationInput>;
  categoryInfoA112?: InputMaybe<CategoryInfoA112OrderByWithRelationInput>;
  categoryInfoA113?: InputMaybe<CategoryInfoA113OrderByWithRelationInput>;
  categoryInfoA524?: InputMaybe<CategoryInfoA524OrderByWithRelationInput>;
  categoryInfoA525?: InputMaybe<CategoryInfoA525OrderByWithRelationInput>;
  categoryInfoB378?: InputMaybe<CategoryInfoB378OrderByWithRelationInput>;
  categoryInfoB719?: InputMaybe<CategoryInfoB719OrderByWithRelationInput>;
  categoryInfoB956?: InputMaybe<CategoryInfoB956OrderByWithRelationInput>;
  code?: InputMaybe<SortOrder>;
  codeA001?: InputMaybe<SortOrder>;
  codeA006?: InputMaybe<SortOrder>;
  codeA027?: InputMaybe<SortOrder>;
  codeA112?: InputMaybe<SortOrder>;
  codeA113?: InputMaybe<SortOrder>;
  codeA524?: InputMaybe<SortOrder>;
  codeA525?: InputMaybe<SortOrder>;
  codeB378?: InputMaybe<SortOrder>;
  codeB719?: InputMaybe<SortOrder>;
  codeB956?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByWithRelationInput>;
};

export type CategoryInfoA077Type = {
  __typename?: 'CategoryInfoA077Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA077WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA077WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA077WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA077WhereInput>>;
  categoryInfoA001?: InputMaybe<CategoryInfoA001WhereInput>;
  categoryInfoA006?: InputMaybe<CategoryInfoA006WhereInput>;
  categoryInfoA027?: InputMaybe<CategoryInfoA027WhereInput>;
  categoryInfoA112?: InputMaybe<CategoryInfoA112WhereInput>;
  categoryInfoA113?: InputMaybe<CategoryInfoA113WhereInput>;
  categoryInfoA524?: InputMaybe<CategoryInfoA524WhereInput>;
  categoryInfoA525?: InputMaybe<CategoryInfoA525WhereInput>;
  categoryInfoB378?: InputMaybe<CategoryInfoB378WhereInput>;
  categoryInfoB719?: InputMaybe<CategoryInfoB719WhereInput>;
  categoryInfoB956?: InputMaybe<CategoryInfoB956WhereInput>;
  code?: InputMaybe<StringFilter>;
  codeA001?: InputMaybe<StringFilter>;
  codeA006?: InputMaybe<StringFilter>;
  codeA027?: InputMaybe<StringFilter>;
  codeA112?: InputMaybe<StringFilter>;
  codeA113?: InputMaybe<StringFilter>;
  codeA524?: InputMaybe<StringFilter>;
  codeA525?: InputMaybe<StringFilter>;
  codeB378?: InputMaybe<StringFilter>;
  codeB719?: InputMaybe<StringFilter>;
  codeB956?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077WhereInput>;
};

export type CategoryInfoA112 = {
  __typename?: 'CategoryInfoA112';
  activeSillDataA112: Array<SillInfoA112>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA112: SillInfoA112;
};


export type CategoryInfoA112ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA112ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA112WhereInput>;
  none?: InputMaybe<CategoryInfoA112WhereInput>;
  some?: InputMaybe<CategoryInfoA112WhereInput>;
};

export type CategoryInfoA112OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA112OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA112?: InputMaybe<SillInfoA112OrderByWithRelationInput>;
};

export type CategoryInfoA112Type = {
  __typename?: 'CategoryInfoA112Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA112WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA112WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA112WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA112WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA112?: InputMaybe<SillInfoA112WhereInput>;
};

export type CategoryInfoA113 = {
  __typename?: 'CategoryInfoA113';
  activeSillDataA113: Array<SillInfoA113>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA113: SillInfoA113;
};


export type CategoryInfoA113ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA113ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA113WhereInput>;
  none?: InputMaybe<CategoryInfoA113WhereInput>;
  some?: InputMaybe<CategoryInfoA113WhereInput>;
};

export type CategoryInfoA113OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA113OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA113?: InputMaybe<SillInfoA113OrderByWithRelationInput>;
};

export type CategoryInfoA113Type = {
  __typename?: 'CategoryInfoA113Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA113WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA113WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA113WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA113WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA113?: InputMaybe<SillInfoA113WhereInput>;
};

export type CategoryInfoA524 = {
  __typename?: 'CategoryInfoA524';
  activeSillDataA524: Array<SillInfoA524>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA524: SillInfoA524;
};


export type CategoryInfoA524ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA524ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA524WhereInput>;
  none?: InputMaybe<CategoryInfoA524WhereInput>;
  some?: InputMaybe<CategoryInfoA524WhereInput>;
};

export type CategoryInfoA524OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA524OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA524?: InputMaybe<SillInfoA524OrderByWithRelationInput>;
};

export type CategoryInfoA524Type = {
  __typename?: 'CategoryInfoA524Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA524WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA524WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA524WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA524WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA524?: InputMaybe<SillInfoA524WhereInput>;
};

export type CategoryInfoA525 = {
  __typename?: 'CategoryInfoA525';
  activeSillDataA525: Array<SillInfoA525>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoA525: SillInfoA525;
};


export type CategoryInfoA525ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoA525ListRelationFilter = {
  every?: InputMaybe<CategoryInfoA525WhereInput>;
  none?: InputMaybe<CategoryInfoA525WhereInput>;
  some?: InputMaybe<CategoryInfoA525WhereInput>;
};

export type CategoryInfoA525OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoA525OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoA525?: InputMaybe<SillInfoA525OrderByWithRelationInput>;
};

export type CategoryInfoA525Type = {
  __typename?: 'CategoryInfoA525Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoA525WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoA525WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoA525WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoA525WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoA525?: InputMaybe<SillInfoA525WhereInput>;
};

export type CategoryInfoB378 = {
  __typename?: 'CategoryInfoB378';
  activeSillDataB378: Array<SillInfoB378>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoB378: SillInfoB378;
};


export type CategoryInfoB378ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoB378ListRelationFilter = {
  every?: InputMaybe<CategoryInfoB378WhereInput>;
  none?: InputMaybe<CategoryInfoB378WhereInput>;
  some?: InputMaybe<CategoryInfoB378WhereInput>;
};

export type CategoryInfoB378OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoB378OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  codeA077?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoB378?: InputMaybe<SillInfoB378OrderByWithRelationInput>;
};

export type CategoryInfoB378Type = {
  __typename?: 'CategoryInfoB378Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoB378WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoB378WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoB378WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoB378WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  codeA077?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoB378?: InputMaybe<SillInfoB378WhereInput>;
};

export type CategoryInfoB719 = {
  __typename?: 'CategoryInfoB719';
  activeSillDataB719: Array<SillInfoB719>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoB719: SillInfoB719;
};


export type CategoryInfoB719ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoB719ListRelationFilter = {
  every?: InputMaybe<CategoryInfoB719WhereInput>;
  none?: InputMaybe<CategoryInfoB719WhereInput>;
  some?: InputMaybe<CategoryInfoB719WhereInput>;
};

export type CategoryInfoB719OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoB719OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoB719?: InputMaybe<SillInfoB719OrderByWithRelationInput>;
};

export type CategoryInfoB719Type = {
  __typename?: 'CategoryInfoB719Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoB719WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoB719WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoB719WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoB719WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoB719?: InputMaybe<SillInfoB719WhereInput>;
};

export type CategoryInfoB956 = {
  __typename?: 'CategoryInfoB956';
  activeSillDataB956: Array<SillInfoB956>;
  code: Scalars['String']['output'];
  depth1: Scalars['String']['output'];
  depth2: Scalars['String']['output'];
  depth3: Scalars['String']['output'];
  depth4: Scalars['String']['output'];
  depth5: Scalars['String']['output'];
  depth6: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  product: Array<Product>;
  sillCode: Scalars['String']['output'];
  sillInfoB956: SillInfoB956;
};


export type CategoryInfoB956ProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryInfoB956ListRelationFilter = {
  every?: InputMaybe<CategoryInfoB956WhereInput>;
  none?: InputMaybe<CategoryInfoB956WhereInput>;
  some?: InputMaybe<CategoryInfoB956WhereInput>;
};

export type CategoryInfoB956OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type CategoryInfoB956OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  depth1?: InputMaybe<SortOrder>;
  depth2?: InputMaybe<SortOrder>;
  depth3?: InputMaybe<SortOrder>;
  depth4?: InputMaybe<SortOrder>;
  depth5?: InputMaybe<SortOrder>;
  depth6?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  sillCode?: InputMaybe<SortOrder>;
  sillInfoB956?: InputMaybe<SillInfoB956OrderByWithRelationInput>;
};

export type CategoryInfoB956Type = {
  __typename?: 'CategoryInfoB956Type';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CategoryInfoB956WhereInput = {
  AND?: InputMaybe<Array<CategoryInfoB956WhereInput>>;
  NOT?: InputMaybe<Array<CategoryInfoB956WhereInput>>;
  OR?: InputMaybe<Array<CategoryInfoB956WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  depth1?: InputMaybe<StringFilter>;
  depth2?: InputMaybe<StringFilter>;
  depth3?: InputMaybe<StringFilter>;
  depth4?: InputMaybe<StringFilter>;
  depth5?: InputMaybe<StringFilter>;
  depth6?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  sillCode?: InputMaybe<StringFilter>;
  sillInfoB956?: InputMaybe<SillInfoB956WhereInput>;
};

export type CategoryInformationType = {
  __typename?: 'CategoryInformationType';
  categoryInfoA001?: Maybe<CategoryInfoA001Type>;
  categoryInfoA006?: Maybe<CategoryInfoA006Type>;
  categoryInfoA027?: Maybe<CategoryInfoA027Type>;
  categoryInfoA112?: Maybe<CategoryInfoA112Type>;
  categoryInfoA113?: Maybe<CategoryInfoA113Type>;
  categoryInfoA524?: Maybe<CategoryInfoA524Type>;
  categoryInfoA525?: Maybe<CategoryInfoA525Type>;
  categoryInfoB378?: Maybe<CategoryInfoB378Type>;
  categoryInfoB719?: Maybe<CategoryInfoB719Type>;
  categoryInfoB956?: Maybe<CategoryInfoB956Type>;
  code: Scalars['String']['output'];
  code_a001?: Maybe<Scalars['String']['output']>;
  code_a006?: Maybe<Scalars['String']['output']>;
  code_a027?: Maybe<Scalars['String']['output']>;
  code_a077?: Maybe<Scalars['String']['output']>;
  code_a112?: Maybe<Scalars['String']['output']>;
  code_a113?: Maybe<Scalars['String']['output']>;
  code_a524?: Maybe<Scalars['String']['output']>;
  code_a525?: Maybe<Scalars['String']['output']>;
  code_b378?: Maybe<Scalars['String']['output']>;
  code_b719?: Maybe<Scalars['String']['output']>;
  code_b956?: Maybe<Scalars['String']['output']>;
  depth1?: Maybe<Scalars['String']['output']>;
  depth2?: Maybe<Scalars['String']['output']>;
  depth3?: Maybe<Scalars['String']['output']>;
  depth4?: Maybe<Scalars['String']['output']>;
  depth5?: Maybe<Scalars['String']['output']>;
  depth6?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type CategorySelectType = {
  __typename?: 'CategorySelectType';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ChangeProductCategoryCodeInput = {
  newCode: Scalars['String']['input'];
  oldCode: Scalars['String']['input'];
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DescriptionDataInput = {
  description: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};

export type EnumAdminStateFilter = {
  equals?: InputMaybe<AdminState>;
  in?: InputMaybe<Array<AdminState>>;
  not?: InputMaybe<NestedEnumAdminStateFilter>;
  notIn?: InputMaybe<Array<AdminState>>;
};

export type EnumPurchaseLogStateFilter = {
  equals?: InputMaybe<PurchaseLogState>;
  in?: InputMaybe<Array<PurchaseLogState>>;
  not?: InputMaybe<NestedEnumPurchaseLogStateFilter>;
  notIn?: InputMaybe<Array<PurchaseLogState>>;
};

export type EnumPurchaseLogTypeFilter = {
  equals?: InputMaybe<PurchaseLogType>;
  in?: InputMaybe<Array<PurchaseLogType>>;
  not?: InputMaybe<NestedEnumPurchaseLogTypeFilter>;
  notIn?: InputMaybe<Array<PurchaseLogType>>;
};

export type EnumUserStateFilter = {
  equals?: InputMaybe<UserState>;
  in?: InputMaybe<Array<UserState>>;
  not?: InputMaybe<NestedEnumUserStateFilter>;
  notIn?: InputMaybe<Array<UserState>>;
};

export enum ExcelSampleEnum {
  CollectProduct = 'COLLECT_PRODUCT',
  DenyWord = 'DENY_WORD',
  ReplaceWord = 'REPLACE_WORD'
}

export type FloatFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type FloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  EditPassword: Scalars['String']['output'];
  EditPasswordCreateVerification: Scalars['String']['output'];
  ProductOptionNameSwap: Scalars['Boolean']['output'];
  ProductOptionValueSwap: Scalars['Boolean']['output'];
  addWordByExcelByUser: Scalars['Boolean']['output'];
  addWordByUser: Scalars['Boolean']['output'];
  cancelPurchasePlanByUser: Scalars['Boolean']['output'];
  cardPayTest: Scalars['String']['output'];
  changeMyPasswordByAdmin: Scalars['Boolean']['output'];
  changePasswordByUser: Scalars['Boolean']['output'];
  changeProductCategoryCode: Scalars['Int']['output'];
  checkESMPlus: Scalars['String']['output'];
  connectSocialIdByUser: User;
  coupangCategorySillCodeInput: Scalars['String']['output'];
  coupangProductStoreDelete: Scalars['String']['output'];
  createCategoryInfoByAdmin: Scalars['Boolean']['output'];
  createNewOrder: Scalars['Int']['output'];
  createNoticeByAdmin: Scalars['Boolean']['output'];
  createUserQuestionByUser: Scalars['Boolean']['output'];
  deleteCategoryInfoByAdmin?: Maybe<Scalars['Int']['output']>;
  deleteNoticeByAdmin: Scalars['Int']['output'];
  deleteProductByAdmin: Scalars['Boolean']['output'];
  deleteProductByUser: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  deleteUserByAdmin: Scalars['Boolean']['output'];
  deleteUserProductByAdmin: Scalars['Boolean']['output'];
  deleteWordByUser: Scalars['Boolean']['output'];
  disableUserOption: Scalars['Boolean']['output'];
  endProductSellStateByAdmin: Scalars['Int']['output'];
  endProductSellStateByUser: Scalars['Int']['output'];
  extendMyAccountByUser: Scalars['Boolean']['output'];
  findEmail: Scalars['String']['output'];
  findEmailCreateVerification: Scalars['String']['output'];
  getProductListAllKeys: Scalars['Boolean']['output'];
  getTaobaoItemUsingExtensionByUser: Scalars['String']['output'];
  initProductDescriptionByUser?: Maybe<Scalars['String']['output']>;
  initProductImageByUser?: Maybe<Scalars['String']['output']>;
  initProductOptionImageByUser?: Maybe<Scalars['String']['output']>;
  initProductThumbnailImageByUser?: Maybe<Scalars['String']['output']>;
  invalidatePurchaseInfoByAdmin: Scalars['Boolean']['output'];
  modifyWordByUser: Scalars['Boolean']['output'];
  purchasePlanByUser: Scalars['Int']['output'];
  requestPhoneVerificationByEveryone: Scalars['Boolean']['output'];
  resetKeywardList: Scalars['Boolean']['output'];
  restoreProductOptionValue: Scalars['String']['output'];
  selectProductViewLogByUser: Scalars['String']['output'];
  selectProductViewLogDateByUser: Scalars['String']['output'];
  selectProductViewLogDatefilterByUser: Scalars['String']['output'];
  setLockProduct: Scalars['String']['output'];
  setMaxProductLimitByAdmin: Scalars['Boolean']['output'];
  setMultiPurchaseInfoByAdmin: Scalars['Boolean']['output'];
  setProductOptionNameBySomeOne: Scalars['Boolean']['output'];
  setProductOptionValueBySomeOne: Scalars['String']['output'];
  setPurchaseInfoByAdmin: Scalars['Boolean']['output'];
  setUserStopTest: Scalars['Boolean']['output'];
  signInAdminByEveryone: SignInType;
  signInUserByEveryone: SignInType;
  signOutUserByEveryone: Scalars['String']['output'];
  signUpAdminByAdmin: Scalars['Boolean']['output'];
  signUpUserByEveryone2: Scalars['String']['output'];
  silentRefreshToken?: Maybe<SignInType>;
  t_createProduct?: Maybe<Scalars['Boolean']['output']>;
  testAddjobCallBack: Scalars['Boolean']['output'];
  testProductStoreCnt: Scalars['String']['output'];
  transferProductsToUserByAdmin: Scalars['String']['output'];
  translateProductTextByUser: Scalars['String']['output'];
  translateProductsTextByUser: Scalars['String']['output'];
  unlinkProductStore: Scalars['Boolean']['output'];
  updateCategoryInfoA077MatchingByAdmin: Scalars['Boolean']['output'];
  updateCnyRateByAdmin: Scalars['Float']['output'];
  updateDescription: Scalars['String']['output'];
  updateFreeUserDayLimitByAdmin: Scalars['Int']['output'];
  updateFreeUserProductLimitByAdmin: Scalars['Int']['output'];
  updateImageThumbnailData: Scalars['String']['output'];
  updateKeywardList: Scalars['String']['output'];
  updateManyDescription: Scalars['String']['output'];
  updateManyKeywardList: Scalars['String']['output'];
  updateManyProductAttributeByUser: Scalars['String']['output'];
  updateManyProductCategoryByAdmin: Scalars['Int']['output'];
  updateManyProductCategoryByUser: Scalars['Int']['output'];
  updateManyProductFee: Scalars['String']['output'];
  updateManyProductNameByUser: Scalars['String']['output'];
  updateManyProductOption: Scalars['String']['output'];
  updateManyProductOptionValue: Scalars['String']['output'];
  updateManyProductSiilInfoByAdmin: Scalars['Int']['output'];
  updateManyProductSiilInfoByUser: Scalars['Int']['output'];
  updateManyProductTagByUser: Scalars['String']['output'];
  updateMultipleProductNameByUser: Scalars['String']['output'];
  updateMyDataByUser: Scalars['Boolean']['output'];
  updateMyImageByUser: Scalars['Boolean']['output'];
  updateNewProductImageBySomeone: Scalars['String']['output'];
  updateNoticeByAdmin: Scalars['Boolean']['output'];
  updatePhoneByUser: Scalars['Boolean']['output'];
  updatePlanInfoByAdmin: PlanInfo;
  updateProductAttributeByUser: Scalars['String']['output'];
  updateProductByAdmin: Product;
  updateProductByUser: Product;
  updateProductCategory: Scalars['String']['output'];
  updateProductCategory2: Scalars['String']['output'];
  updateProductFee: Scalars['String']['output'];
  updateProductImageBySomeone: Product;
  updateProductImageBySomeone2: Scalars['String']['output'];
  updateProductNameByAdmin: Scalars['String']['output'];
  updateProductNameByUser: Scalars['String']['output'];
  updateProductOption: Array<Scalars['Int']['output']>;
  updateProductOptionShippingFee?: Maybe<Scalars['String']['output']>;
  updateProductPriceByAdmin: Scalars['Int']['output'];
  updateProductPriceByUser: Scalars['Int']['output'];
  updateProductSillCodesByUser?: Maybe<Scalars['String']['output']>;
  updateProductSillDatasByUser?: Maybe<Scalars['String']['output']>;
  updateProductSinglePriceByUser: Scalars['String']['output'];
  updateProductStoreUrlInfoBySomeone: Scalars['String']['output'];
  updateProductTagByUser: Scalars['String']['output'];
  updateTaobaoRefreshDayByAdmin: Scalars['Int']['output'];
  updateUserQuestionByAdmin: Scalars['Boolean']['output'];
  verifyPhoneByEveryone: Scalars['String']['output'];
};


export type MutationEditPasswordArgs = {
  checkNewPassword: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  verificationNumber: Scalars['String']['input'];
};


export type MutationEditPasswordCreateVerificationArgs = {
  email: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};


export type MutationProductOptionNameSwapArgs = {
  data: Array<ProductOptionNameSwapInput>;
};


export type MutationProductOptionValueSwapArgs = {
  data: Array<ProductOptionValueSwapInput>;
};


export type MutationAddWordByExcelByUserArgs = {
  data: Scalars['Upload']['input'];
  isReplace: Scalars['Boolean']['input'];
};


export type MutationAddWordByUserArgs = {
  findWord: Scalars['String']['input'];
  replaceWord?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelPurchasePlanByUserArgs = {
  merchantUid: Scalars['String']['input'];
};


export type MutationCardPayTestArgs = {
  email: Scalars['String']['input'];
};


export type MutationChangeMyPasswordByAdminArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationChangePasswordByUserArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationChangeProductCategoryCodeArgs = {
  data: Array<ChangeProductCategoryCodeInput>;
  shopCode: Scalars['String']['input'];
};


export type MutationCheckEsmPlusArgs = {
  productId: Scalars['Int']['input'];
  siteCode: Scalars['String']['input'];
};


export type MutationConnectSocialIdByUserArgs = {
  socialId: Scalars['String']['input'];
  userType: UserSocialType;
};


export type MutationCoupangCategorySillCodeInputArgs = {
  data: Array<SillCodeInput>;
};


export type MutationCoupangProductStoreDeleteArgs = {
  productId: Scalars['Int']['input'];
};


export type MutationCreateCategoryInfoByAdminArgs = {
  data: Array<CategoryCreateInput>;
  shopCode: Scalars['String']['input'];
};


export type MutationCreateNewOrderArgs = {
  data: Array<NewOrderInput>;
};


export type MutationCreateNoticeByAdminArgs = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateUserQuestionByUserArgs = {
  attachment?: InputMaybe<Array<Scalars['Upload']['input']>>;
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationDeleteCategoryInfoByAdminArgs = {
  data: Array<Scalars['String']['input']>;
  shopCode: Scalars['String']['input'];
};


export type MutationDeleteNoticeByAdminArgs = {
  noticeIds: Array<Scalars['Int']['input']>;
};


export type MutationDeleteProductByAdminArgs = {
  productId: Array<Scalars['Int']['input']>;
};


export type MutationDeleteProductByUserArgs = {
  productId: Array<Scalars['Int']['input']>;
};


export type MutationDeleteStoreArgs = {
  id: Scalars['Int']['input'];
  store: Scalars['String']['input'];
};


export type MutationDeleteUserByAdminArgs = {
  userId: Array<Scalars['Int']['input']>;
};


export type MutationDeleteUserProductByAdminArgs = {
  userId: Array<Scalars['Int']['input']>;
};


export type MutationDeleteWordByUserArgs = {
  wordId: Array<Scalars['Int']['input']>;
};


export type MutationDisableUserOptionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationEndProductSellStateByAdminArgs = {
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationEndProductSellStateByUserArgs = {
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationExtendMyAccountByUserArgs = {
  masterId: Scalars['Int']['input'];
  slaveIds: Array<Scalars['Int']['input']>;
};


export type MutationFindEmailArgs = {
  phone: Scalars['String']['input'];
  verificationNumber: Scalars['String']['input'];
};


export type MutationFindEmailCreateVerificationArgs = {
  phoneNumber: Scalars['String']['input'];
};


export type MutationGetTaobaoItemUsingExtensionByUserArgs = {
  data: Scalars['String']['input'];
};


export type MutationInitProductDescriptionByUserArgs = {
  productId: Scalars['Int']['input'];
};


export type MutationInitProductImageByUserArgs = {
  productId: Scalars['Int']['input'];
};


export type MutationInitProductOptionImageByUserArgs = {
  productId: Scalars['Int']['input'];
};


export type MutationInitProductThumbnailImageByUserArgs = {
  productId: Scalars['Int']['input'];
};


export type MutationInvalidatePurchaseInfoByAdminArgs = {
  purchaseLogId: Scalars['Int']['input'];
};


export type MutationModifyWordByUserArgs = {
  findWord: Scalars['String']['input'];
  replaceWord?: InputMaybe<Scalars['String']['input']>;
  wordId: Scalars['Int']['input'];
};


export type MutationPurchasePlanByUserArgs = {
  merchantUid: Scalars['String']['input'];
  planInfoId: Scalars['Int']['input'];
};


export type MutationRequestPhoneVerificationByEveryoneArgs = {
  phoneNumber: Scalars['String']['input'];
};


export type MutationResetKeywardListArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationRestoreProductOptionValueArgs = {
  productOptionNameId: Scalars['Int']['input'];
};


export type MutationSelectProductViewLogByUserArgs = {
  timeEnd: Scalars['String']['input'];
  timeStart: Scalars['String']['input'];
};


export type MutationSelectProductViewLogDateByUserArgs = {
  timeEnd: Scalars['String']['input'];
  timeStart: Scalars['String']['input'];
};


export type MutationSelectProductViewLogDatefilterByUserArgs = {
  productId?: InputMaybe<Scalars['Int']['input']>;
  productName?: InputMaybe<Scalars['String']['input']>;
  timeEnd: Scalars['String']['input'];
  timeStart: Scalars['String']['input'];
};


export type MutationSetLockProductArgs = {
  mylock: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationSetMaxProductLimitByAdminArgs = {
  productLimit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['Int']['input'];
};


export type MutationSetMultiPurchaseInfoByAdminArgs = {
  credit: Scalars['Int']['input'];
  purchaseInputs: Array<PurchaseInputs>;
};


export type MutationSetProductOptionNameBySomeOneArgs = {
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  productOptionNameId: Scalars['Int']['input'];
};


export type MutationSetProductOptionValueBySomeOneArgs = {
  image?: InputMaybe<Scalars['String']['input']>;
  isActive: Scalars['Boolean']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  newImage?: InputMaybe<Scalars['Upload']['input']>;
  productOptionNameId?: InputMaybe<Scalars['Int']['input']>;
  productOptionValueId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationSetPurchaseInfoByAdminArgs = {
  expiredAt?: InputMaybe<Scalars['DateTime']['input']>;
  planInfoId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationSetUserStopTestArgs = {
  userId: Scalars['Int']['input'];
};


export type MutationSignInAdminByEveryoneArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignInUserByEveryoneArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userType: UserSocialType;
};


export type MutationSignUpAdminByAdminArgs = {
  id: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpUserByEveryone2Args = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  refCode?: InputMaybe<Scalars['String']['input']>;
  verificationId?: Scalars['Int']['input'];
};


export type MutationSilentRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationTestAddjobCallBackArgs = {
  response: Scalars['String']['input'];
};


export type MutationTestProductStoreCntArgs = {
  productId: Scalars['Int']['input'];
  siteCode: Scalars['String']['input'];
};


export type MutationTransferProductsToUserByAdminArgs = {
  productIds: Array<Scalars['Int']['input']>;
  targetUserId: Scalars['Int']['input'];
};


export type MutationTranslateProductTextByUserArgs = {
  id: Scalars['Int']['input'];
  type: TranslateTargetEnumType;
};


export type MutationTranslateProductsTextByUserArgs = {
  ids: Array<Scalars['Int']['input']>;
  type: TranslateTargetEnumType;
};


export type MutationUnlinkProductStoreArgs = {
  productId: Scalars['Int']['input'];
  siteCode: Scalars['String']['input'];
};


export type MutationUpdateCategoryInfoA077MatchingByAdminArgs = {
  data: UpdateCategoryInfoA077MatchingByAdminInput;
};


export type MutationUpdateCnyRateByAdminArgs = {
  cnyRate: Scalars['Float']['input'];
};


export type MutationUpdateDescriptionArgs = {
  description: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationUpdateFreeUserDayLimitByAdminArgs = {
  day: Scalars['Int']['input'];
};


export type MutationUpdateFreeUserProductLimitByAdminArgs = {
  day: Scalars['Int']['input'];
};


export type MutationUpdateImageThumbnailDataArgs = {
  productId: Scalars['Int']['input'];
  thumbnails?: InputMaybe<Array<ProductThumbnailUpdateInput>>;
};


export type MutationUpdateKeywardListArgs = {
  myKeyward: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationUpdateManyDescriptionArgs = {
  data: Array<DescriptionDataInput>;
};


export type MutationUpdateManyKeywardListArgs = {
  myKeyward: Scalars['String']['input'];
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationUpdateManyProductAttributeByUserArgs = {
  brandName?: InputMaybe<Scalars['String']['input']>;
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  productId: Array<Scalars['Int']['input']>;
};


export type MutationUpdateManyProductCategoryByAdminArgs = {
  categoryA001?: InputMaybe<Scalars['String']['input']>;
  categoryA006?: InputMaybe<Scalars['String']['input']>;
  categoryA027?: InputMaybe<Scalars['String']['input']>;
  categoryA077?: InputMaybe<Scalars['String']['input']>;
  categoryA112?: InputMaybe<Scalars['String']['input']>;
  categoryB378?: InputMaybe<Scalars['String']['input']>;
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationUpdateManyProductCategoryByUserArgs = {
  categoryA001?: InputMaybe<Scalars['String']['input']>;
  categoryA006?: InputMaybe<Scalars['String']['input']>;
  categoryA027?: InputMaybe<Scalars['String']['input']>;
  categoryA077?: InputMaybe<Scalars['String']['input']>;
  categoryA112?: InputMaybe<Scalars['String']['input']>;
  categoryA113?: InputMaybe<Scalars['String']['input']>;
  categoryA524?: InputMaybe<Scalars['String']['input']>;
  categoryA525?: InputMaybe<Scalars['String']['input']>;
  categoryB378?: InputMaybe<Scalars['String']['input']>;
  categoryB719?: InputMaybe<Scalars['String']['input']>;
  categoryB956?: InputMaybe<Scalars['String']['input']>;
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationUpdateManyProductFeeArgs = {
  auctionFee?: InputMaybe<Scalars['Float']['input']>;
  coupangFee?: InputMaybe<Scalars['Float']['input']>;
  gmarketFee?: InputMaybe<Scalars['Float']['input']>;
  interparkFee?: InputMaybe<Scalars['Float']['input']>;
  lotteonFee?: InputMaybe<Scalars['Float']['input']>;
  lotteonNormalFee?: InputMaybe<Scalars['Float']['input']>;
  naverFee?: InputMaybe<Scalars['Float']['input']>;
  productId: Array<Scalars['Int']['input']>;
  streetFee?: InputMaybe<Scalars['Float']['input']>;
  streetNormalFee?: InputMaybe<Scalars['Float']['input']>;
  tmonFee?: InputMaybe<Scalars['Float']['input']>;
  wemakepriceFee?: InputMaybe<Scalars['Float']['input']>;
};


export type MutationUpdateManyProductNameByUserArgs = {
  body?: InputMaybe<Scalars['String']['input']>;
  head?: InputMaybe<Scalars['String']['input']>;
  productIds: Array<Scalars['Int']['input']>;
  tail?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateManyProductOptionArgs = {
  data: Array<ProductOptionInput>;
};


export type MutationUpdateManyProductOptionValueArgs = {
  data: Array<ProductOptionValueInput>;
};


export type MutationUpdateManyProductSiilInfoByAdminArgs = {
  productIds: Array<Scalars['Int']['input']>;
  siilCode: Scalars['String']['input'];
};


export type MutationUpdateManyProductSiilInfoByUserArgs = {
  productIds: Array<Scalars['Int']['input']>;
  siilCode: Scalars['String']['input'];
};


export type MutationUpdateManyProductTagByUserArgs = {
  immSearchTags?: InputMaybe<Scalars['String']['input']>;
  productIds: Array<Scalars['Int']['input']>;
  searchTags?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateMultipleProductNameByUserArgs = {
  data: Array<ProductOptionNameInput>;
};


export type MutationUpdateMyDataByUserArgs = {
  additionalShippingFeeJeju?: InputMaybe<Scalars['Int']['input']>;
  asInformation?: InputMaybe<Scalars['String']['input']>;
  asTel?: InputMaybe<Scalars['String']['input']>;
  auctionFee?: InputMaybe<Scalars['Float']['input']>;
  auctionUseType?: InputMaybe<Scalars['String']['input']>;
  autoPrice?: InputMaybe<Scalars['String']['input']>;
  calculateWonType?: InputMaybe<Scalars['String']['input']>;
  cnyRate?: InputMaybe<Scalars['Float']['input']>;
  cnyRateDollar?: InputMaybe<Scalars['Float']['input']>;
  cnyRateEuro?: InputMaybe<Scalars['Float']['input']>;
  cnyRateYen?: InputMaybe<Scalars['Float']['input']>;
  collectCheckPosition?: InputMaybe<Scalars['String']['input']>;
  collectStock?: InputMaybe<Scalars['Int']['input']>;
  collectTimeout?: InputMaybe<Scalars['Int']['input']>;
  coupangAccessKey?: InputMaybe<Scalars['String']['input']>;
  coupangDefaultInbound?: InputMaybe<Scalars['String']['input']>;
  coupangDefaultOutbound?: InputMaybe<Scalars['String']['input']>;
  coupangFee?: InputMaybe<Scalars['Float']['input']>;
  coupangImageOpt?: InputMaybe<Scalars['String']['input']>;
  coupangLoginId?: InputMaybe<Scalars['String']['input']>;
  coupangMaximumBuyForPerson?: InputMaybe<Scalars['Int']['input']>;
  coupangOutboundShippingTimeDay?: InputMaybe<Scalars['Int']['input']>;
  coupangSecretKey?: InputMaybe<Scalars['String']['input']>;
  coupangUnionDeliveryType?: InputMaybe<Scalars['String']['input']>;
  coupangUseType?: InputMaybe<Scalars['String']['input']>;
  coupangVendorId?: InputMaybe<Scalars['String']['input']>;
  defaultPrice?: InputMaybe<Scalars['String']['input']>;
  defaultShippingFee?: InputMaybe<Scalars['Int']['input']>;
  descriptionShowTitle?: InputMaybe<Scalars['String']['input']>;
  discountAmount?: InputMaybe<Scalars['Int']['input']>;
  discountUnitType?: InputMaybe<Scalars['String']['input']>;
  esmplusAuctionId?: InputMaybe<Scalars['String']['input']>;
  esmplusGmarketId?: InputMaybe<Scalars['String']['input']>;
  esmplusMasterId?: InputMaybe<Scalars['String']['input']>;
  exchangeShippingFee?: InputMaybe<Scalars['Int']['input']>;
  extraShippingFee?: InputMaybe<Scalars['Int']['input']>;
  fixImageBottom?: InputMaybe<Scalars['Upload']['input']>;
  fixImageSubBottom?: InputMaybe<Scalars['Upload']['input']>;
  fixImageSubTop?: InputMaybe<Scalars['Upload']['input']>;
  fixImageTop?: InputMaybe<Scalars['Upload']['input']>;
  gmarketFee?: InputMaybe<Scalars['Float']['input']>;
  gmarketUseType?: InputMaybe<Scalars['String']['input']>;
  interparkCertKey?: InputMaybe<Scalars['String']['input']>;
  interparkEditCertKey?: InputMaybe<Scalars['String']['input']>;
  interparkEditSecretKey?: InputMaybe<Scalars['String']['input']>;
  interparkFee?: InputMaybe<Scalars['Float']['input']>;
  interparkSecretKey?: InputMaybe<Scalars['String']['input']>;
  interparkUseType?: InputMaybe<Scalars['String']['input']>;
  lotteonApiKey?: InputMaybe<Scalars['String']['input']>;
  lotteonFee?: InputMaybe<Scalars['Float']['input']>;
  lotteonNormalFee?: InputMaybe<Scalars['Float']['input']>;
  lotteonNormalUseType?: InputMaybe<Scalars['String']['input']>;
  lotteonSellerType?: InputMaybe<Scalars['String']['input']>;
  lotteonUseType?: InputMaybe<Scalars['String']['input']>;
  lotteonVendorId?: InputMaybe<Scalars['String']['input']>;
  marginRate?: InputMaybe<Scalars['Float']['input']>;
  marginUnitType?: InputMaybe<Scalars['String']['input']>;
  naverAutoSearchTag?: InputMaybe<Scalars['String']['input']>;
  naverFee?: InputMaybe<Scalars['Float']['input']>;
  naverOrigin?: InputMaybe<Scalars['String']['input']>;
  naverOriginCode?: InputMaybe<Scalars['String']['input']>;
  naverStoreOnly?: InputMaybe<Scalars['String']['input']>;
  naverStoreUrl?: InputMaybe<Scalars['String']['input']>;
  naverUseType?: InputMaybe<Scalars['String']['input']>;
  optionAlignTop?: InputMaybe<Scalars['String']['input']>;
  optionIndexType?: InputMaybe<Scalars['Int']['input']>;
  optionTwoWays?: InputMaybe<Scalars['String']['input']>;
  orderToDeliveryMembership?: InputMaybe<Scalars['String']['input']>;
  orderToDeliveryMethod?: InputMaybe<Scalars['String']['input']>;
  orderToDeliveryName?: InputMaybe<Scalars['String']['input']>;
  refundShippingFee?: InputMaybe<Scalars['Int']['input']>;
  sellerCatId?: InputMaybe<Scalars['String']['input']>;
  sillFromCategory?: InputMaybe<Scalars['String']['input']>;
  streetApiKey?: InputMaybe<Scalars['String']['input']>;
  streetApiKey2?: InputMaybe<Scalars['String']['input']>;
  streetApiKey3?: InputMaybe<Scalars['String']['input']>;
  streetApiKey4?: InputMaybe<Scalars['String']['input']>;
  streetApiMemo?: InputMaybe<Scalars['String']['input']>;
  streetApiMemo2?: InputMaybe<Scalars['String']['input']>;
  streetApiMemo3?: InputMaybe<Scalars['String']['input']>;
  streetApiMemo4?: InputMaybe<Scalars['String']['input']>;
  streetDefaultInbound?: InputMaybe<Scalars['String']['input']>;
  streetDefaultOutbound?: InputMaybe<Scalars['String']['input']>;
  streetFee?: InputMaybe<Scalars['Float']['input']>;
  streetNormalApiKey?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiKey2?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiKey3?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiKey4?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiMemo?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiMemo2?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiMemo3?: InputMaybe<Scalars['String']['input']>;
  streetNormalApiMemo4?: InputMaybe<Scalars['String']['input']>;
  streetNormalFee?: InputMaybe<Scalars['Float']['input']>;
  streetNormalInbound?: InputMaybe<Scalars['String']['input']>;
  streetNormalOutbound?: InputMaybe<Scalars['String']['input']>;
  streetNormalUseKeyType?: InputMaybe<Scalars['String']['input']>;
  streetNormalUseType?: InputMaybe<Scalars['String']['input']>;
  streetUseKeyType?: InputMaybe<Scalars['String']['input']>;
  streetUseType?: InputMaybe<Scalars['String']['input']>;
  thumbnailRepresentNo?: InputMaybe<Scalars['String']['input']>;
  tmonFee?: InputMaybe<Scalars['Float']['input']>;
  tmonId?: InputMaybe<Scalars['String']['input']>;
  tmonUseType?: InputMaybe<Scalars['String']['input']>;
  useDetailInformation?: InputMaybe<Scalars['String']['input']>;
  wemakepriceFee?: InputMaybe<Scalars['Float']['input']>;
  wemakepriceId?: InputMaybe<Scalars['String']['input']>;
  wemakepriceUseType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateMyImageByUserArgs = {
  fixImageBottom?: InputMaybe<Scalars['String']['input']>;
  fixImageSubBottom?: InputMaybe<Scalars['String']['input']>;
  fixImageSubTop?: InputMaybe<Scalars['String']['input']>;
  fixImageTop?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateNewProductImageBySomeoneArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  optionValues: Array<ProductOptionValueImageUpdateInput>;
  productId: Scalars['Int']['input'];
  thumbnails?: InputMaybe<Array<ProductNewThumbnailImageUpdateInput>>;
};


export type MutationUpdateNoticeByAdminArgs = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  noticeId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePhoneByUserArgs = {
  phone: Scalars['String']['input'];
  verificationId: Scalars['Int']['input'];
};


export type MutationUpdatePlanInfoByAdminArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  planId: Scalars['Int']['input'];
  price?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateProductAttributeByUserArgs = {
  brandName?: InputMaybe<Scalars['String']['input']>;
  manufacturer?: InputMaybe<Scalars['String']['input']>;
  modelName?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
};


export type MutationUpdateProductByAdminArgs = {
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  localShippingFee?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionNames: Array<ProductOptionNameUpdateInput>;
  optionValues: Array<ProductOptionValueUpdateInput>;
  options: Array<ProductOptionUpdateInput>;
  price?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['Int']['input'];
  shippingFee?: InputMaybe<Scalars['Int']['input']>;
  siilCode?: InputMaybe<Scalars['String']['input']>;
  siilData?: InputMaybe<Array<SiilInput>>;
  thumbnails?: InputMaybe<Array<ProductThumbnailUpdateInput>>;
};


export type MutationUpdateProductByUserArgs = {
  categoryA001?: InputMaybe<Scalars['String']['input']>;
  categoryA006?: InputMaybe<Scalars['String']['input']>;
  categoryA027?: InputMaybe<Scalars['String']['input']>;
  categoryA077?: InputMaybe<Scalars['String']['input']>;
  categoryA112?: InputMaybe<Scalars['String']['input']>;
  categoryA113?: InputMaybe<Scalars['String']['input']>;
  categoryA524?: InputMaybe<Scalars['String']['input']>;
  categoryA525?: InputMaybe<Scalars['String']['input']>;
  categoryB378?: InputMaybe<Scalars['String']['input']>;
  categoryB719?: InputMaybe<Scalars['String']['input']>;
  categoryB956?: InputMaybe<Scalars['String']['input']>;
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  localShippingCode?: InputMaybe<Scalars['Int']['input']>;
  localShippingFee?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  optionNames: Array<ProductOptionNameUpdateInput>;
  optionValues: Array<ProductOptionValueUpdateInput>;
  options: Array<ProductOptionUpdateInput>;
  price?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['Int']['input'];
  shippingFee?: InputMaybe<Scalars['Int']['input']>;
  siilCode?: InputMaybe<Scalars['String']['input']>;
  siilData?: InputMaybe<Array<SiilInput>>;
  thumbnails?: InputMaybe<Array<ProductThumbnailUpdateInput>>;
};


export type MutationUpdateProductCategoryArgs = {
  categoryA001?: InputMaybe<Scalars['String']['input']>;
  categoryA006?: InputMaybe<Scalars['String']['input']>;
  categoryA027?: InputMaybe<Scalars['String']['input']>;
  categoryA077?: InputMaybe<Scalars['String']['input']>;
  categoryA112?: InputMaybe<Scalars['String']['input']>;
  categoryA113?: InputMaybe<Scalars['String']['input']>;
  categoryA524?: InputMaybe<Scalars['String']['input']>;
  categoryA525?: InputMaybe<Scalars['String']['input']>;
  categoryB378?: InputMaybe<Scalars['String']['input']>;
  categoryB719?: InputMaybe<Scalars['String']['input']>;
  categoryB956?: InputMaybe<Scalars['String']['input']>;
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
};


export type MutationUpdateProductCategory2Args = {
  categoryA001?: InputMaybe<Scalars['String']['input']>;
  categoryA006?: InputMaybe<Scalars['String']['input']>;
  categoryA027?: InputMaybe<Scalars['String']['input']>;
  categoryA077?: InputMaybe<Scalars['String']['input']>;
  categoryA112?: InputMaybe<Scalars['String']['input']>;
  categoryA113?: InputMaybe<Scalars['String']['input']>;
  categoryA524?: InputMaybe<Scalars['String']['input']>;
  categoryA525?: InputMaybe<Scalars['String']['input']>;
  categoryB378?: InputMaybe<Scalars['String']['input']>;
  categoryB719?: InputMaybe<Scalars['String']['input']>;
  categoryB956?: InputMaybe<Scalars['String']['input']>;
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
};


export type MutationUpdateProductFeeArgs = {
  auctionFee?: InputMaybe<Scalars['Float']['input']>;
  coupangFee?: InputMaybe<Scalars['Float']['input']>;
  gmarketFee?: InputMaybe<Scalars['Float']['input']>;
  interparkFee?: InputMaybe<Scalars['Float']['input']>;
  lotteonFee?: InputMaybe<Scalars['Float']['input']>;
  lotteonNormalFee?: InputMaybe<Scalars['Float']['input']>;
  naverFee?: InputMaybe<Scalars['Float']['input']>;
  productId: Scalars['Int']['input'];
  streetFee?: InputMaybe<Scalars['Float']['input']>;
  streetNormalFee?: InputMaybe<Scalars['Float']['input']>;
  tmonFee?: InputMaybe<Scalars['Float']['input']>;
  wemakepriceFee?: InputMaybe<Scalars['Float']['input']>;
};


export type MutationUpdateProductImageBySomeoneArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  optionValues: Array<ProductOptionValueImageUpdateInput>;
  productId: Scalars['Int']['input'];
  thumbnails?: InputMaybe<Array<ProductThumbnailImageUpdateInput>>;
};


export type MutationUpdateProductImageBySomeone2Args = {
  description?: InputMaybe<Scalars['String']['input']>;
  optionValues: Array<ProductOptionValueImageUpdateInput>;
  productId: Scalars['Int']['input'];
  thumbnails?: InputMaybe<Array<ProductThumbnailImageUpdateInput>>;
};


export type MutationUpdateProductNameByAdminArgs = {
  name: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationUpdateProductNameByUserArgs = {
  name: Scalars['String']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationUpdateProductOptionArgs = {
  id: Scalars['Int']['input'];
  productOption: Array<SetProductOption>;
};


export type MutationUpdateProductOptionShippingFeeArgs = {
  defaultShippingFee: Scalars['Int']['input'];
  productOptionId: Scalars['Int']['input'];
};


export type MutationUpdateProductPriceByAdminArgs = {
  cnyRate: Scalars['Float']['input'];
  localShippingCode?: InputMaybe<Scalars['Int']['input']>;
  localShippingFee: Scalars['Int']['input'];
  marginRate: Scalars['Float']['input'];
  marginUnitType: Scalars['String']['input'];
  productIds: Array<Scalars['Int']['input']>;
  shippingFee: Scalars['Int']['input'];
};


export type MutationUpdateProductPriceByUserArgs = {
  cnyRate: Scalars['Float']['input'];
  localShippingCode?: InputMaybe<Scalars['Int']['input']>;
  localShippingFee: Scalars['Int']['input'];
  marginRate: Scalars['Float']['input'];
  marginUnitType: Scalars['String']['input'];
  productIds: Array<Scalars['Int']['input']>;
  shippingFee: Scalars['Int']['input'];
};


export type MutationUpdateProductSillCodesByUserArgs = {
  code_a001?: InputMaybe<Scalars['String']['input']>;
  code_a006?: InputMaybe<Scalars['String']['input']>;
  code_a027?: InputMaybe<Scalars['String']['input']>;
  code_a077?: InputMaybe<Scalars['String']['input']>;
  code_a112?: InputMaybe<Scalars['String']['input']>;
  code_a113?: InputMaybe<Scalars['String']['input']>;
  code_a524?: InputMaybe<Scalars['String']['input']>;
  code_a525?: InputMaybe<Scalars['String']['input']>;
  code_b378?: InputMaybe<Scalars['String']['input']>;
  code_b719?: InputMaybe<Scalars['String']['input']>;
  code_b956?: InputMaybe<Scalars['String']['input']>;
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationUpdateProductSillDatasByUserArgs = {
  data_a001?: InputMaybe<Scalars['String']['input']>;
  data_a006?: InputMaybe<Scalars['String']['input']>;
  data_a027?: InputMaybe<Scalars['String']['input']>;
  data_a077?: InputMaybe<Scalars['String']['input']>;
  data_a112?: InputMaybe<Scalars['String']['input']>;
  data_a113?: InputMaybe<Scalars['String']['input']>;
  data_a524?: InputMaybe<Scalars['String']['input']>;
  data_a525?: InputMaybe<Scalars['String']['input']>;
  data_b378?: InputMaybe<Scalars['String']['input']>;
  data_b719?: InputMaybe<Scalars['String']['input']>;
  data_b956?: InputMaybe<Scalars['String']['input']>;
  productIds: Array<Scalars['Int']['input']>;
};


export type MutationUpdateProductSinglePriceByUserArgs = {
  price: Scalars['Int']['input'];
  productId: Scalars['Int']['input'];
};


export type MutationUpdateProductStoreUrlInfoBySomeoneArgs = {
  productStoreId: Scalars['Int']['input'];
  storeProductId: Scalars['String']['input'];
};


export type MutationUpdateProductTagByUserArgs = {
  immSearchTags?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
  searchTags?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateTaobaoRefreshDayByAdminArgs = {
  day: Scalars['Int']['input'];
};


export type MutationUpdateUserQuestionByAdminArgs = {
  answer: Scalars['String']['input'];
  userQuestionId: Scalars['Int']['input'];
};


export type MutationVerifyPhoneByEveryoneArgs = {
  phoneNumber: Scalars['String']['input'];
  verificationNumber: Scalars['String']['input'];
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedBoolNullableFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolNullableFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedEnumAdminStateFilter = {
  equals?: InputMaybe<AdminState>;
  in?: InputMaybe<Array<AdminState>>;
  not?: InputMaybe<NestedEnumAdminStateFilter>;
  notIn?: InputMaybe<Array<AdminState>>;
};

export type NestedEnumPurchaseLogStateFilter = {
  equals?: InputMaybe<PurchaseLogState>;
  in?: InputMaybe<Array<PurchaseLogState>>;
  not?: InputMaybe<NestedEnumPurchaseLogStateFilter>;
  notIn?: InputMaybe<Array<PurchaseLogState>>;
};

export type NestedEnumPurchaseLogTypeFilter = {
  equals?: InputMaybe<PurchaseLogType>;
  in?: InputMaybe<Array<PurchaseLogType>>;
  not?: InputMaybe<NestedEnumPurchaseLogTypeFilter>;
  notIn?: InputMaybe<Array<PurchaseLogType>>;
};

export type NestedEnumUserStateFilter = {
  equals?: InputMaybe<UserState>;
  in?: InputMaybe<Array<UserState>>;
  not?: InputMaybe<NestedEnumUserStateFilter>;
  notIn?: InputMaybe<Array<UserState>>;
};

export type NestedFloatFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedFloatNullableFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Notice = {
  __typename?: 'Notice';
  attachmentFile?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  contentSummary: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isVisible: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  viewCount: Scalars['Int']['output'];
};


export type NoticeContentSummaryArgs = {
  wordCount?: InputMaybe<Scalars['Int']['input']>;
};

export type NoticeOrderByWithRelationInput = {
  attachmentFile?: InputMaybe<SortOrder>;
  content?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isVisible?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  viewCount?: InputMaybe<SortOrder>;
};

export type NoticeWhereInput = {
  AND?: InputMaybe<Array<NoticeWhereInput>>;
  NOT?: InputMaybe<Array<NoticeWhereInput>>;
  OR?: InputMaybe<Array<NoticeWhereInput>>;
  attachmentFile?: InputMaybe<StringNullableFilter>;
  content?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  isVisible?: InputMaybe<BoolFilter>;
  title?: InputMaybe<StringFilter>;
  viewCount?: InputMaybe<IntFilter>;
};

export type NoticeWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderListRelationFilter = {
  every?: InputMaybe<OrderWhereInput>;
  none?: InputMaybe<OrderWhereInput>;
  some?: InputMaybe<OrderWhereInput>;
};

export type PhoneVerification = {
  __typename?: 'PhoneVerification';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  tel: Scalars['String']['output'];
  used?: Maybe<Scalars['Int']['output']>;
  verificationNumber: Scalars['String']['output'];
};

export type PlanInfo = {
  __typename?: 'PlanInfo';
  description: Scalars['String']['output'];
  externalFeatureVariableId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  month: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  planLevel?: Maybe<Scalars['Int']['output']>;
  price: Scalars['Int']['output'];
};

export type PlanInfoOrderByWithRelationInput = {
  description?: InputMaybe<SortOrder>;
  externalFeatureVariableId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isActive?: InputMaybe<SortOrder>;
  month?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  planLevel?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
};

export type PlanInfoWhereInput = {
  AND?: InputMaybe<Array<PlanInfoWhereInput>>;
  NOT?: InputMaybe<Array<PlanInfoWhereInput>>;
  OR?: InputMaybe<Array<PlanInfoWhereInput>>;
  description?: InputMaybe<StringFilter>;
  externalFeatureVariableId?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  isActive?: InputMaybe<BoolFilter>;
  month?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  planLevel?: InputMaybe<IntNullableFilter>;
  price?: InputMaybe<IntFilter>;
};

export type PlanInfoWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type Product = {
  __typename?: 'Product';
  activeProductStore: Array<ProductStore>;
  activeTaobaoProduct: TaobaoProduct;
  admin?: Maybe<Admin>;
  adminId?: Maybe<Scalars['Int']['output']>;
  attribute: Scalars['String']['output'];
  auctionFee?: Maybe<Scalars['Float']['output']>;
  brandName: Scalars['String']['output'];
  categoryInfoA001?: Maybe<CategoryInfoA001>;
  categoryInfoA006?: Maybe<CategoryInfoA006>;
  categoryInfoA027?: Maybe<CategoryInfoA027>;
  categoryInfoA077?: Maybe<CategoryInfoA077>;
  categoryInfoA112?: Maybe<CategoryInfoA112>;
  categoryInfoA113?: Maybe<CategoryInfoA113>;
  categoryInfoA524?: Maybe<CategoryInfoA524>;
  categoryInfoA525?: Maybe<CategoryInfoA525>;
  categoryInfoB378?: Maybe<CategoryInfoB378>;
  categoryInfoB719?: Maybe<CategoryInfoB719>;
  categoryInfoB956?: Maybe<CategoryInfoB956>;
  cnyRate: Scalars['Float']['output'];
  coupangFee?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  gmarketFee?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  imageThumbnail: Array<Scalars['String']['output']>;
  imageThumbnailData: Scalars['String']['output'];
  immSearchTags?: Maybe<Scalars['String']['output']>;
  interparkFee?: Maybe<Scalars['Float']['output']>;
  isImageTranslated: Scalars['Boolean']['output'];
  localShippingCode?: Maybe<Scalars['Int']['output']>;
  localShippingFee: Scalars['Int']['output'];
  lotteonFee?: Maybe<Scalars['Float']['output']>;
  lotteonNormalFee?: Maybe<Scalars['Float']['output']>;
  manuFacturer: Scalars['String']['output'];
  marginRate: Scalars['Float']['output'];
  marginUnitType?: Maybe<Scalars['String']['output']>;
  modelName: Scalars['String']['output'];
  modifiedAt: Scalars['DateTime']['output'];
  myKeyward?: Maybe<Scalars['String']['output']>;
  myLock?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  naverFee?: Maybe<Scalars['Float']['output']>;
  optionInfoHtml: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  productCode: Scalars['String']['output'];
  productOption: Array<ProductOption>;
  productOptionName: Array<ProductOptionName>;
  productStateEnum: ProductStateEnum;
  productStore: Array<ProductStore>;
  searchTags?: Maybe<Scalars['String']['output']>;
  shippingFee: Scalars['Int']['output'];
  siilCode?: Maybe<Scalars['String']['output']>;
  siilData?: Maybe<Scalars['String']['output']>;
  siilInfo?: Maybe<SiilSavedData>;
  sillCodeA001: Scalars['String']['output'];
  sillCodeA006: Scalars['String']['output'];
  sillCodeA027: Scalars['String']['output'];
  sillCodeA077: Scalars['String']['output'];
  sillCodeA112: Scalars['String']['output'];
  sillCodeA113: Scalars['String']['output'];
  sillCodeA524: Scalars['String']['output'];
  sillCodeA525: Scalars['String']['output'];
  sillCodeB378: Scalars['String']['output'];
  sillCodeB719: Scalars['String']['output'];
  sillCodeB956: Scalars['String']['output'];
  sillDataA001: Scalars['String']['output'];
  sillDataA006: Scalars['String']['output'];
  sillDataA027: Scalars['String']['output'];
  sillDataA077: Scalars['String']['output'];
  sillDataA112: Scalars['String']['output'];
  sillDataA113: Scalars['String']['output'];
  sillDataA524: Scalars['String']['output'];
  sillDataA525: Scalars['String']['output'];
  sillDataB378: Scalars['String']['output'];
  sillDataB719: Scalars['String']['output'];
  sillDataB956: Scalars['String']['output'];
  state: Scalars['Int']['output'];
  stockUpdatedAt: Scalars['DateTime']['output'];
  streetFee?: Maybe<Scalars['Float']['output']>;
  streetNormalFee?: Maybe<Scalars['Float']['output']>;
  taobaoProduct: TaobaoProduct;
  taobaoProductId: Scalars['Int']['output'];
  tmonFee?: Maybe<Scalars['Float']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['Int']['output']>;
  wemakepriceFee?: Maybe<Scalars['Float']['output']>;
};


export type ProductProductOptionArgs = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};


export type ProductProductOptionNameArgs = {
  cursor?: InputMaybe<ProductOptionNameWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionNameOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionNameWhereInput>;
};


export type ProductProductStoreArgs = {
  cursor?: InputMaybe<ProductStoreWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductStoreOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductStoreWhereInput>;
};

export type ProductListRelationFilter = {
  every?: InputMaybe<ProductWhereInput>;
  none?: InputMaybe<ProductWhereInput>;
  some?: InputMaybe<ProductWhereInput>;
};

export type ProductNewThumbnailImageUpdateInput = {
  index: Scalars['Int']['input'];
  uploadImageBase64?: InputMaybe<Scalars['String']['input']>;
};

export type ProductOption = {
  __typename?: 'ProductOption';
  defaultShippingFee?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  optionString: Scalars['String']['output'];
  optionValue1Id: Scalars['Int']['output'];
  optionValue2Id?: Maybe<Scalars['Int']['output']>;
  optionValue3Id?: Maybe<Scalars['Int']['output']>;
  optionValue4Id?: Maybe<Scalars['Int']['output']>;
  optionValue5Id?: Maybe<Scalars['Int']['output']>;
  price: Scalars['Int']['output'];
  priceCny: Scalars['Float']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  productOption1: ProductOptionValue;
  productOption2?: Maybe<ProductOptionValue>;
  productOption3?: Maybe<ProductOptionValue>;
  productOption4?: Maybe<ProductOptionValue>;
  productOption5?: Maybe<ProductOptionValue>;
  stock?: Maybe<Scalars['Int']['output']>;
  taobaoSkuId: Scalars['String']['output'];
};

export type ProductOptionInput = {
  defaultShippingFee?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  productOptionId: Scalars['Int']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOptionListRelationFilter = {
  every?: InputMaybe<ProductOptionWhereInput>;
  none?: InputMaybe<ProductOptionWhereInput>;
  some?: InputMaybe<ProductOptionWhereInput>;
};

export type ProductOptionName = {
  __typename?: 'ProductOptionName';
  id: Scalars['Int']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isNameTranslated: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  product: Product;
  productId: Scalars['Int']['output'];
  productOptionValue: Array<ProductOptionValue>;
  taobaoPid: Scalars['String']['output'];
};


export type ProductOptionNameProductOptionValueArgs = {
  cursor?: InputMaybe<ProductOptionValueWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionValueOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionValueWhereInput>;
};

export type ProductOptionNameInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  productIds: Scalars['Int']['input'];
};

export type ProductOptionNameListRelationFilter = {
  every?: InputMaybe<ProductOptionNameWhereInput>;
  none?: InputMaybe<ProductOptionNameWhereInput>;
  some?: InputMaybe<ProductOptionNameWhereInput>;
};

export type ProductOptionNameOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductOptionNameOrderByWithRelationInput = {
  hasImage?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isActive?: InputMaybe<SortOrder>;
  isNameTranslated?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByWithRelationInput>;
  productId?: InputMaybe<SortOrder>;
  productOptionValue?: InputMaybe<ProductOptionValueOrderByRelationAggregateInput>;
  taobaoPid?: InputMaybe<SortOrder>;
};

export type ProductOptionNameSwapInput = {
  order?: InputMaybe<Scalars['Int']['input']>;
  productOptionNameId: Scalars['Int']['input'];
};

export type ProductOptionNameUpdateInput = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type ProductOptionNameWhereInput = {
  AND?: InputMaybe<Array<ProductOptionNameWhereInput>>;
  NOT?: InputMaybe<Array<ProductOptionNameWhereInput>>;
  OR?: InputMaybe<Array<ProductOptionNameWhereInput>>;
  hasImage?: InputMaybe<BoolFilter>;
  id?: InputMaybe<IntFilter>;
  isActive?: InputMaybe<BoolNullableFilter>;
  isNameTranslated?: InputMaybe<BoolFilter>;
  name?: InputMaybe<StringFilter>;
  order?: InputMaybe<IntFilter>;
  product?: InputMaybe<ProductWhereInput>;
  productId?: InputMaybe<IntFilter>;
  productOptionValue?: InputMaybe<ProductOptionValueListRelationFilter>;
  taobaoPid?: InputMaybe<StringFilter>;
};

export type ProductOptionNameWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOptionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductOptionOrderByWithRelationInput = {
  defaultShippingFee?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isActive?: InputMaybe<SortOrder>;
  optionString?: InputMaybe<SortOrder>;
  optionValue1Id?: InputMaybe<SortOrder>;
  optionValue2Id?: InputMaybe<SortOrder>;
  optionValue3Id?: InputMaybe<SortOrder>;
  optionValue4Id?: InputMaybe<SortOrder>;
  optionValue5Id?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
  priceCny?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByWithRelationInput>;
  productId?: InputMaybe<SortOrder>;
  productOption1?: InputMaybe<ProductOptionValueOrderByWithRelationInput>;
  productOption2?: InputMaybe<ProductOptionValueOrderByWithRelationInput>;
  productOption3?: InputMaybe<ProductOptionValueOrderByWithRelationInput>;
  productOption4?: InputMaybe<ProductOptionValueOrderByWithRelationInput>;
  productOption5?: InputMaybe<ProductOptionValueOrderByWithRelationInput>;
  stock?: InputMaybe<SortOrder>;
  taobaoSkuId?: InputMaybe<SortOrder>;
};

export type ProductOptionUq_Product_Id_Sku_IdCompoundUniqueInput = {
  productId: Scalars['Int']['input'];
  taobaoSkuId: Scalars['String']['input'];
};

export type ProductOptionUq_Product_OptionCompoundUniqueInput = {
  optionValue1Id: Scalars['Int']['input'];
  optionValue2Id: Scalars['Int']['input'];
  optionValue3Id: Scalars['Int']['input'];
  optionValue4Id: Scalars['Int']['input'];
  optionValue5Id: Scalars['Int']['input'];
};

export type ProductOptionUpdateInput = {
  id: Scalars['Int']['input'];
  isActive: Scalars['Boolean']['input'];
  price: Scalars['Int']['input'];
  stock: Scalars['Int']['input'];
};

export type ProductOptionValue = {
  __typename?: 'ProductOptionValue';
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  isNameTranslated: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  optionNameOrder: Scalars['Int']['output'];
  optionValue1: Array<ProductOption>;
  optionValue2: Array<ProductOption>;
  optionValue3: Array<ProductOption>;
  optionValue4: Array<ProductOption>;
  optionValue5: Array<ProductOption>;
  originalName?: Maybe<Scalars['String']['output']>;
  productOption: Array<ProductOption>;
  productOptionName: ProductOptionName;
  productOptionNameId: Scalars['Int']['output'];
  taobaoVid: Scalars['String']['output'];
};


export type ProductOptionValueOptionValue1Args = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};


export type ProductOptionValueOptionValue2Args = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};


export type ProductOptionValueOptionValue3Args = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};


export type ProductOptionValueOptionValue4Args = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};


export type ProductOptionValueOptionValue5Args = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOptionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};


export type ProductOptionValueProductOptionArgs = {
  cursor?: InputMaybe<ProductOptionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<InputMaybe<ProductOptionOrderByWithRelationInput>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductOptionWhereInput>;
};

export type ProductOptionValueBySomeOne = {
  newImage: Scalars['Upload']['input'];
};

export type ProductOptionValueImageUpdateInput = {
  id: Scalars['Int']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  newImageBase64?: InputMaybe<Scalars['String']['input']>;
};

export type ProductOptionValueInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  productOptionValueId: Scalars['Int']['input'];
};

export type ProductOptionValueListRelationFilter = {
  every?: InputMaybe<ProductOptionValueWhereInput>;
  none?: InputMaybe<ProductOptionValueWhereInput>;
  some?: InputMaybe<ProductOptionValueWhereInput>;
};

export type ProductOptionValueOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductOptionValueOrderByWithRelationInput = {
  id?: InputMaybe<SortOrder>;
  image?: InputMaybe<SortOrder>;
  isActive?: InputMaybe<SortOrder>;
  isNameTranslated?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  number?: InputMaybe<SortOrder>;
  optionNameOrder?: InputMaybe<SortOrder>;
  optionValue1?: InputMaybe<ProductOptionOrderByRelationAggregateInput>;
  optionValue2?: InputMaybe<ProductOptionOrderByRelationAggregateInput>;
  optionValue3?: InputMaybe<ProductOptionOrderByRelationAggregateInput>;
  optionValue4?: InputMaybe<ProductOptionOrderByRelationAggregateInput>;
  optionValue5?: InputMaybe<ProductOptionOrderByRelationAggregateInput>;
  originalName?: InputMaybe<SortOrder>;
  productOptionName?: InputMaybe<ProductOptionNameOrderByWithRelationInput>;
  productOptionNameId?: InputMaybe<SortOrder>;
  taobaoVid?: InputMaybe<SortOrder>;
};

export type ProductOptionValueSwapInput = {
  number?: InputMaybe<Scalars['Int']['input']>;
  productOptionValueId: Scalars['Int']['input'];
};

export type ProductOptionValueUpdateInput = {
  id: Scalars['Int']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  newImage?: InputMaybe<Scalars['Upload']['input']>;
  newImageBase64?: InputMaybe<Scalars['String']['input']>;
};

export type ProductOptionValueWhereInput = {
  AND?: InputMaybe<Array<ProductOptionValueWhereInput>>;
  NOT?: InputMaybe<Array<ProductOptionValueWhereInput>>;
  OR?: InputMaybe<Array<ProductOptionValueWhereInput>>;
  id?: InputMaybe<IntFilter>;
  image?: InputMaybe<StringNullableFilter>;
  isActive?: InputMaybe<BoolFilter>;
  isNameTranslated?: InputMaybe<BoolFilter>;
  name?: InputMaybe<StringFilter>;
  number?: InputMaybe<IntFilter>;
  optionNameOrder?: InputMaybe<IntFilter>;
  optionValue1?: InputMaybe<ProductOptionListRelationFilter>;
  optionValue2?: InputMaybe<ProductOptionListRelationFilter>;
  optionValue3?: InputMaybe<ProductOptionListRelationFilter>;
  optionValue4?: InputMaybe<ProductOptionListRelationFilter>;
  optionValue5?: InputMaybe<ProductOptionListRelationFilter>;
  originalName?: InputMaybe<StringNullableFilter>;
  productOptionName?: InputMaybe<ProductOptionNameWhereInput>;
  productOptionNameId?: InputMaybe<IntFilter>;
  taobaoVid?: InputMaybe<StringFilter>;
};

export type ProductOptionValueWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOptionWhereInput = {
  AND?: InputMaybe<Array<ProductOptionWhereInput>>;
  NOT?: InputMaybe<Array<ProductOptionWhereInput>>;
  OR?: InputMaybe<Array<ProductOptionWhereInput>>;
  defaultShippingFee?: InputMaybe<IntNullableFilter>;
  id?: InputMaybe<IntFilter>;
  isActive?: InputMaybe<BoolFilter>;
  optionString?: InputMaybe<StringFilter>;
  optionValue1Id?: InputMaybe<IntFilter>;
  optionValue2Id?: InputMaybe<IntNullableFilter>;
  optionValue3Id?: InputMaybe<IntNullableFilter>;
  optionValue4Id?: InputMaybe<IntNullableFilter>;
  optionValue5Id?: InputMaybe<IntNullableFilter>;
  price?: InputMaybe<IntFilter>;
  priceCny?: InputMaybe<FloatFilter>;
  product?: InputMaybe<ProductWhereInput>;
  productId?: InputMaybe<IntFilter>;
  productOption1?: InputMaybe<ProductOptionValueWhereInput>;
  productOption2?: InputMaybe<ProductOptionValueWhereInput>;
  productOption3?: InputMaybe<ProductOptionValueWhereInput>;
  productOption4?: InputMaybe<ProductOptionValueWhereInput>;
  productOption5?: InputMaybe<ProductOptionValueWhereInput>;
  stock?: InputMaybe<IntNullableFilter>;
  taobaoSkuId?: InputMaybe<StringFilter>;
};

export type ProductOptionWhereUniqueInput = {
  UQ_product_id_sku_id?: InputMaybe<ProductOptionUq_Product_Id_Sku_IdCompoundUniqueInput>;
  UQ_product_option?: InputMaybe<ProductOptionUq_Product_OptionCompoundUniqueInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductOrderByWithRelationInput = {
  admin?: InputMaybe<AdminOrderByWithRelationInput>;
  adminId?: InputMaybe<SortOrder>;
  attribute?: InputMaybe<SortOrder>;
  auctionFee?: InputMaybe<SortOrder>;
  brandName?: InputMaybe<SortOrder>;
  categoryA001?: InputMaybe<SortOrder>;
  categoryA006?: InputMaybe<SortOrder>;
  categoryA027?: InputMaybe<SortOrder>;
  categoryA077?: InputMaybe<SortOrder>;
  categoryA112?: InputMaybe<SortOrder>;
  categoryA113?: InputMaybe<SortOrder>;
  categoryA524?: InputMaybe<SortOrder>;
  categoryA525?: InputMaybe<SortOrder>;
  categoryB378?: InputMaybe<SortOrder>;
  categoryB719?: InputMaybe<SortOrder>;
  categoryB956?: InputMaybe<SortOrder>;
  categoryEsm?: InputMaybe<SortOrder>;
  categoryInfoA001?: InputMaybe<CategoryInfoA001OrderByWithRelationInput>;
  categoryInfoA006?: InputMaybe<CategoryInfoA006OrderByWithRelationInput>;
  categoryInfoA027?: InputMaybe<CategoryInfoA027OrderByWithRelationInput>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByWithRelationInput>;
  categoryInfoA112?: InputMaybe<CategoryInfoA112OrderByWithRelationInput>;
  categoryInfoA113?: InputMaybe<CategoryInfoA113OrderByWithRelationInput>;
  categoryInfoA524?: InputMaybe<CategoryInfoA524OrderByWithRelationInput>;
  categoryInfoA525?: InputMaybe<CategoryInfoA525OrderByWithRelationInput>;
  categoryInfoB378?: InputMaybe<CategoryInfoB378OrderByWithRelationInput>;
  categoryInfoB719?: InputMaybe<CategoryInfoB719OrderByWithRelationInput>;
  categoryInfoB956?: InputMaybe<CategoryInfoB956OrderByWithRelationInput>;
  cnyRate?: InputMaybe<SortOrder>;
  coupangFee?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  gmarketFee?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  imageThumbnailData?: InputMaybe<SortOrder>;
  immSearchTags?: InputMaybe<SortOrder>;
  interparkFee?: InputMaybe<SortOrder>;
  isImageTranslated?: InputMaybe<SortOrder>;
  localShippingCode?: InputMaybe<SortOrder>;
  localShippingFee?: InputMaybe<SortOrder>;
  lotteonFee?: InputMaybe<SortOrder>;
  lotteonNormalFee?: InputMaybe<SortOrder>;
  manuFacturer?: InputMaybe<SortOrder>;
  marginRate?: InputMaybe<SortOrder>;
  marginUnitType?: InputMaybe<SortOrder>;
  modelName?: InputMaybe<SortOrder>;
  modifiedAt?: InputMaybe<SortOrder>;
  myKeyward?: InputMaybe<SortOrder>;
  myLock?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  naverFee?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
  productCode?: InputMaybe<SortOrder>;
  productOption?: InputMaybe<ProductOptionOrderByRelationAggregateInput>;
  productOptionName?: InputMaybe<ProductOptionNameOrderByRelationAggregateInput>;
  productStateEnum?: InputMaybe<ProductStateEnumOrderByWithRelationInput>;
  productStore?: InputMaybe<ProductStoreOrderByRelationAggregateInput>;
  productViewLog?: InputMaybe<ProductViewLogOrderByRelationAggregateInput>;
  searchTags?: InputMaybe<SortOrder>;
  shippingFee?: InputMaybe<SortOrder>;
  siilCode?: InputMaybe<SortOrder>;
  siilData?: InputMaybe<SortOrder>;
  sillCodeA001?: InputMaybe<SortOrder>;
  sillCodeA006?: InputMaybe<SortOrder>;
  sillCodeA027?: InputMaybe<SortOrder>;
  sillCodeA077?: InputMaybe<SortOrder>;
  sillCodeA112?: InputMaybe<SortOrder>;
  sillCodeA113?: InputMaybe<SortOrder>;
  sillCodeA524?: InputMaybe<SortOrder>;
  sillCodeA525?: InputMaybe<SortOrder>;
  sillCodeB378?: InputMaybe<SortOrder>;
  sillCodeB719?: InputMaybe<SortOrder>;
  sillCodeB956?: InputMaybe<SortOrder>;
  sillDataA001?: InputMaybe<SortOrder>;
  sillDataA006?: InputMaybe<SortOrder>;
  sillDataA027?: InputMaybe<SortOrder>;
  sillDataA077?: InputMaybe<SortOrder>;
  sillDataA112?: InputMaybe<SortOrder>;
  sillDataA113?: InputMaybe<SortOrder>;
  sillDataA524?: InputMaybe<SortOrder>;
  sillDataA525?: InputMaybe<SortOrder>;
  sillDataB378?: InputMaybe<SortOrder>;
  sillDataB719?: InputMaybe<SortOrder>;
  sillDataB956?: InputMaybe<SortOrder>;
  state?: InputMaybe<SortOrder>;
  stockUpdatedAt?: InputMaybe<SortOrder>;
  streetFee?: InputMaybe<SortOrder>;
  streetNormalFee?: InputMaybe<SortOrder>;
  taobaoProduct?: InputMaybe<TaobaoProductOrderByWithRelationInput>;
  taobaoProductId?: InputMaybe<SortOrder>;
  tmonFee?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
  wemakepriceFee?: InputMaybe<SortOrder>;
};

export type ProductStore = {
  __typename?: 'ProductStore';
  cnt: Scalars['Int']['output'];
  connectedAt: Scalars['DateTime']['output'];
  etcVendorItemId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  inflow?: Maybe<Scalars['Int']['output']>;
  product: Product;
  productId: Scalars['Int']['output'];
  productStoreLog: Array<ProductStoreLog>;
  productStoreState: ProductStoreState;
  siteCode: Scalars['String']['output'];
  state: Scalars['Int']['output'];
  storeProductId?: Maybe<Scalars['String']['output']>;
  storeUrl?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};


export type ProductStoreProductStoreLogArgs = {
  cursor?: InputMaybe<ProductStoreLogWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductStoreLogOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductStoreLogWhereInput>;
};

export type ProductStoreListRelationFilter = {
  every?: InputMaybe<ProductStoreWhereInput>;
  none?: InputMaybe<ProductStoreWhereInput>;
  some?: InputMaybe<ProductStoreWhereInput>;
};

export type ProductStoreLog = {
  __typename?: 'ProductStoreLog';
  createdAt: Scalars['DateTime']['output'];
  destState: Scalars['Int']['output'];
  errorMessage: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  jobId: Scalars['String']['output'];
  modifiedAt: Scalars['DateTime']['output'];
  productStoreId: Scalars['Int']['output'];
  productStoreLogEnum: ProductStoreLogEnum;
  productStoreState: ProductStoreState;
  productstore: ProductStore;
  uploadState: Scalars['Int']['output'];
};

export type ProductStoreLogListRelationFilter = {
  every?: InputMaybe<ProductStoreLogWhereInput>;
  none?: InputMaybe<ProductStoreLogWhereInput>;
  some?: InputMaybe<ProductStoreLogWhereInput>;
};

export type ProductStoreLogOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductStoreLogOrderByWithRelationInput = {
  createdAt?: InputMaybe<SortOrder>;
  destState?: InputMaybe<SortOrder>;
  errorMessage?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  jobId?: InputMaybe<SortOrder>;
  modifiedAt?: InputMaybe<SortOrder>;
  productStoreId?: InputMaybe<SortOrder>;
  productStoreLogEnum?: InputMaybe<ProductStoreLogEnumOrderByWithRelationInput>;
  productStoreState?: InputMaybe<ProductStoreStateOrderByWithRelationInput>;
  productstore?: InputMaybe<ProductStoreOrderByWithRelationInput>;
  uploadState?: InputMaybe<SortOrder>;
};

export type ProductStoreLogWhereInput = {
  AND?: InputMaybe<Array<ProductStoreLogWhereInput>>;
  NOT?: InputMaybe<Array<ProductStoreLogWhereInput>>;
  OR?: InputMaybe<Array<ProductStoreLogWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  destState?: InputMaybe<IntFilter>;
  errorMessage?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  jobId?: InputMaybe<StringFilter>;
  modifiedAt?: InputMaybe<DateTimeFilter>;
  productStoreId?: InputMaybe<IntFilter>;
  productStoreLogEnum?: InputMaybe<ProductStoreLogEnumWhereInput>;
  productStoreState?: InputMaybe<ProductStoreStateWhereInput>;
  productstore?: InputMaybe<ProductStoreWhereInput>;
  uploadState?: InputMaybe<IntFilter>;
};

export type ProductStoreLogWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductStoreOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductStoreOrderByWithRelationInput = {
  cnt?: InputMaybe<SortOrder>;
  connectedAt?: InputMaybe<SortOrder>;
  etcVendorItemId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  inflow?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByWithRelationInput>;
  productId?: InputMaybe<SortOrder>;
  productStoreLog?: InputMaybe<ProductStoreLogOrderByRelationAggregateInput>;
  productStoreState?: InputMaybe<ProductStoreStateOrderByWithRelationInput>;
  productViewLog?: InputMaybe<ProductViewLogOrderByRelationAggregateInput>;
  siteCode?: InputMaybe<SortOrder>;
  state?: InputMaybe<SortOrder>;
  storeProductId?: InputMaybe<SortOrder>;
  storeUrl?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export type ProductStoreState = {
  __typename?: 'ProductStoreState';
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type ProductStoreStateOrderByWithRelationInput = {
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  productStore?: InputMaybe<ProductStoreOrderByRelationAggregateInput>;
  productStoreLog?: InputMaybe<ProductStoreLogOrderByRelationAggregateInput>;
};

export type ProductStoreStateWhereInput = {
  AND?: InputMaybe<Array<ProductStoreStateWhereInput>>;
  NOT?: InputMaybe<Array<ProductStoreStateWhereInput>>;
  OR?: InputMaybe<Array<ProductStoreStateWhereInput>>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  productStore?: InputMaybe<ProductStoreListRelationFilter>;
  productStoreLog?: InputMaybe<ProductStoreLogListRelationFilter>;
};

export type ProductStoreWhereInput = {
  AND?: InputMaybe<Array<ProductStoreWhereInput>>;
  NOT?: InputMaybe<Array<ProductStoreWhereInput>>;
  OR?: InputMaybe<Array<ProductStoreWhereInput>>;
  cnt?: InputMaybe<IntFilter>;
  connectedAt?: InputMaybe<DateTimeFilter>;
  etcVendorItemId?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  inflow?: InputMaybe<IntNullableFilter>;
  product?: InputMaybe<ProductWhereInput>;
  productId?: InputMaybe<IntFilter>;
  productStoreLog?: InputMaybe<ProductStoreLogListRelationFilter>;
  productStoreState?: InputMaybe<ProductStoreStateWhereInput>;
  productViewLog?: InputMaybe<ProductViewLogListRelationFilter>;
  siteCode?: InputMaybe<StringFilter>;
  state?: InputMaybe<IntFilter>;
  storeProductId?: InputMaybe<StringNullableFilter>;
  storeUrl?: InputMaybe<StringNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
};

export type ProductStoreWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductThumbnailImageUpdateInput = {
  defaultImage: Scalars['String']['input'];
  uploadImageBase64?: InputMaybe<Scalars['String']['input']>;
};

export type ProductThumbnailUpdateInput = {
  defaultImage: Scalars['String']['input'];
  uploadImage?: InputMaybe<Scalars['Upload']['input']>;
};

export type ProductUq_User_Id_Taobao_Product_IdCompoundUniqueInput = {
  taobaoProductId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type ProductViewLogListRelationFilter = {
  every?: InputMaybe<ProductViewLogWhereInput>;
  none?: InputMaybe<ProductViewLogWhereInput>;
  some?: InputMaybe<ProductViewLogWhereInput>;
};

export type ProductWhereInput = {
  AND?: InputMaybe<Array<ProductWhereInput>>;
  NOT?: InputMaybe<Array<ProductWhereInput>>;
  OR?: InputMaybe<Array<ProductWhereInput>>;
  admin?: InputMaybe<AdminWhereInput>;
  adminId?: InputMaybe<IntNullableFilter>;
  attribute?: InputMaybe<StringFilter>;
  auctionFee?: InputMaybe<FloatNullableFilter>;
  brandName?: InputMaybe<StringFilter>;
  categoryA001?: InputMaybe<StringNullableFilter>;
  categoryA006?: InputMaybe<StringNullableFilter>;
  categoryA027?: InputMaybe<StringNullableFilter>;
  categoryA077?: InputMaybe<StringNullableFilter>;
  categoryA112?: InputMaybe<StringNullableFilter>;
  categoryA113?: InputMaybe<StringNullableFilter>;
  categoryA524?: InputMaybe<StringNullableFilter>;
  categoryA525?: InputMaybe<StringNullableFilter>;
  categoryB378?: InputMaybe<StringNullableFilter>;
  categoryB719?: InputMaybe<StringNullableFilter>;
  categoryB956?: InputMaybe<StringNullableFilter>;
  categoryEsm?: InputMaybe<StringNullableFilter>;
  categoryInfoA001?: InputMaybe<CategoryInfoA001WhereInput>;
  categoryInfoA006?: InputMaybe<CategoryInfoA006WhereInput>;
  categoryInfoA027?: InputMaybe<CategoryInfoA027WhereInput>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077WhereInput>;
  categoryInfoA112?: InputMaybe<CategoryInfoA112WhereInput>;
  categoryInfoA113?: InputMaybe<CategoryInfoA113WhereInput>;
  categoryInfoA524?: InputMaybe<CategoryInfoA524WhereInput>;
  categoryInfoA525?: InputMaybe<CategoryInfoA525WhereInput>;
  categoryInfoB378?: InputMaybe<CategoryInfoB378WhereInput>;
  categoryInfoB719?: InputMaybe<CategoryInfoB719WhereInput>;
  categoryInfoB956?: InputMaybe<CategoryInfoB956WhereInput>;
  cnyRate?: InputMaybe<FloatFilter>;
  coupangFee?: InputMaybe<FloatNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  description?: InputMaybe<StringFilter>;
  gmarketFee?: InputMaybe<FloatNullableFilter>;
  id?: InputMaybe<IntFilter>;
  imageThumbnailData?: InputMaybe<StringFilter>;
  immSearchTags?: InputMaybe<StringNullableFilter>;
  interparkFee?: InputMaybe<FloatNullableFilter>;
  isImageTranslated?: InputMaybe<BoolFilter>;
  localShippingCode?: InputMaybe<IntNullableFilter>;
  localShippingFee?: InputMaybe<IntFilter>;
  lotteonFee?: InputMaybe<FloatNullableFilter>;
  lotteonNormalFee?: InputMaybe<FloatNullableFilter>;
  manuFacturer?: InputMaybe<StringFilter>;
  marginRate?: InputMaybe<FloatFilter>;
  marginUnitType?: InputMaybe<StringNullableFilter>;
  modelName?: InputMaybe<StringFilter>;
  modifiedAt?: InputMaybe<DateTimeFilter>;
  myKeyward?: InputMaybe<StringNullableFilter>;
  myLock?: InputMaybe<IntNullableFilter>;
  name?: InputMaybe<StringFilter>;
  naverFee?: InputMaybe<FloatNullableFilter>;
  price?: InputMaybe<IntFilter>;
  productCode?: InputMaybe<StringFilter>;
  productOption?: InputMaybe<ProductOptionListRelationFilter>;
  productOptionName?: InputMaybe<ProductOptionNameListRelationFilter>;
  productStateEnum?: InputMaybe<ProductStateEnumWhereInput>;
  productStore?: InputMaybe<ProductStoreListRelationFilter>;
  productViewLog?: InputMaybe<ProductViewLogListRelationFilter>;
  searchTags?: InputMaybe<StringNullableFilter>;
  shippingFee?: InputMaybe<IntFilter>;
  siilCode?: InputMaybe<StringNullableFilter>;
  siilData?: InputMaybe<StringNullableFilter>;
  sillCodeA001?: InputMaybe<StringFilter>;
  sillCodeA006?: InputMaybe<StringFilter>;
  sillCodeA027?: InputMaybe<StringFilter>;
  sillCodeA077?: InputMaybe<StringFilter>;
  sillCodeA112?: InputMaybe<StringFilter>;
  sillCodeA113?: InputMaybe<StringFilter>;
  sillCodeA524?: InputMaybe<StringFilter>;
  sillCodeA525?: InputMaybe<StringFilter>;
  sillCodeB378?: InputMaybe<StringFilter>;
  sillCodeB719?: InputMaybe<StringFilter>;
  sillCodeB956?: InputMaybe<StringFilter>;
  sillDataA001?: InputMaybe<StringFilter>;
  sillDataA006?: InputMaybe<StringFilter>;
  sillDataA027?: InputMaybe<StringFilter>;
  sillDataA077?: InputMaybe<StringFilter>;
  sillDataA112?: InputMaybe<StringFilter>;
  sillDataA113?: InputMaybe<StringFilter>;
  sillDataA524?: InputMaybe<StringFilter>;
  sillDataA525?: InputMaybe<StringFilter>;
  sillDataB378?: InputMaybe<StringFilter>;
  sillDataB719?: InputMaybe<StringFilter>;
  sillDataB956?: InputMaybe<StringFilter>;
  state?: InputMaybe<IntFilter>;
  stockUpdatedAt?: InputMaybe<DateTimeFilter>;
  streetFee?: InputMaybe<FloatNullableFilter>;
  streetNormalFee?: InputMaybe<FloatNullableFilter>;
  taobaoProduct?: InputMaybe<TaobaoProductWhereInput>;
  taobaoProductId?: InputMaybe<IntFilter>;
  tmonFee?: InputMaybe<FloatNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntNullableFilter>;
  wemakepriceFee?: InputMaybe<FloatNullableFilter>;
};

export type ProductWhereUniqueInput = {
  UQ_user_id_taobao_product_id?: InputMaybe<ProductUq_User_Id_Taobao_Product_IdCompoundUniqueInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type PurchaseLog = {
  __typename?: 'PurchaseLog';
  expiredAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  payAmount: Scalars['Int']['output'];
  payId?: Maybe<Scalars['String']['output']>;
  planInfo: Scalars['String']['output'];
  purchasedAt: Scalars['DateTime']['output'];
  state: PurchaseLogState;
  type: PurchaseLogType;
  user: User;
  userId: Scalars['Int']['output'];
};

export type PurchaseLogListRelationFilter = {
  every?: InputMaybe<PurchaseLogWhereInput>;
  none?: InputMaybe<PurchaseLogWhereInput>;
  some?: InputMaybe<PurchaseLogWhereInput>;
};

export type PurchaseLogOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export enum PurchaseLogState {
  Active = 'ACTIVE',
  Ended = 'ENDED',
  Refunded = 'REFUNDED',
  WaitDeposit = 'WAIT_DEPOSIT',
  WaitPayment = 'WAIT_PAYMENT'
}

export enum PurchaseLogType {
  ImageTranslate = 'IMAGE_TRANSLATE',
  Plan = 'PLAN',
  Stock = 'STOCK'
}

export type PurchaseLogWhereInput = {
  AND?: InputMaybe<Array<PurchaseLogWhereInput>>;
  NOT?: InputMaybe<Array<PurchaseLogWhereInput>>;
  OR?: InputMaybe<Array<PurchaseLogWhereInput>>;
  expiredAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  payAmount?: InputMaybe<IntFilter>;
  payId?: InputMaybe<StringNullableFilter>;
  planInfo?: InputMaybe<StringFilter>;
  purchasedAt?: InputMaybe<DateTimeFilter>;
  state?: InputMaybe<EnumPurchaseLogStateFilter>;
  type?: InputMaybe<EnumPurchaseLogTypeFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
};

export type Query = {
  __typename?: 'Query';
  getExcelSampleUrlBySomeone: Scalars['String']['output'];
  getRegisterProductsDataByUser: Scalars['String']['output'];
  searchCategoryInfoA001BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA006BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA027BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA077BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA112BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA113BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA524BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoA525BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoB378BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoB719BySomeone: Array<CategoryInformationType>;
  searchCategoryInfoB956BySomeone: Array<CategoryInformationType>;
  searchManyCategoryInfoA077BySomeone: Array<CategoryInformationType>;
  selectCnyRateByEveryone: Scalars['Float']['output'];
  selectFreeUserDayLimitByAdmin: Scalars['Int']['output'];
  selectFreeUserProductLimitByAdmin: Scalars['Int']['output'];
  selectMyInfoByUser: User;
  selectMyOrderByUser: Array<Order>;
  selectMyProductByAdmin: Array<Product>;
  selectMyProductByUser: Array<Product>;
  selectMyProductsCountByUser: Scalars['Int']['output'];
  selectNoticeByEveryone: Notice;
  selectNoticeCountByAdmin?: Maybe<Scalars['Int']['output']>;
  selectNoticesByEveryone: Array<Notice>;
  selectPapagoApiKeyByEveryone: Scalars['String']['output'];
  selectPlanInfosForEveryone: Array<PlanInfo>;
  selectProductsByAdmin: Array<Product>;
  selectProductsBySomeone: Array<Product>;
  selectProductsCountByAdmin?: Maybe<Scalars['Int']['output']>;
  selectProductsCountBySomeone?: Maybe<Scalars['Int']['output']>;
  selectSiilInfoBySomeone: Array<SiilItems>;
  selectTaobaoProductsByAdmin: Array<TaobaoProduct>;
  selectTaobaoProductsByUser: Array<TaobaoProduct>;
  selectTaobaoProductsCountByAdmin?: Maybe<Scalars['Int']['output']>;
  selectTaobaoRefreshDayByEveryone: Scalars['Int']['output'];
  selectUserLogsByUser: Array<UserLog>;
  selectUserQuestionBySomeone: Array<UserQuestion>;
  selectUserQuestionCountBySomeone?: Maybe<Scalars['Int']['output']>;
  selectUsersByAdmin: Array<User>;
  selectUsersCountByAdmin: Scalars['Int']['output'];
  selectWordTablesBySomeone: Array<WordTable>;
  seletExistPurchaseLog: Scalars['Boolean']['output'];
  t_get?: Maybe<Scalars['String']['output']>;
  t_getEncodedSetInfo?: Maybe<Scalars['String']['output']>;
  testS3DeleteProduct?: Maybe<Scalars['String']['output']>;
  translateText: Scalars['String']['output'];
  whoami?: Maybe<Scalars['String']['output']>;
};


export type QueryGetExcelSampleUrlBySomeoneArgs = {
  type: ExcelSampleEnum;
};


export type QueryGetRegisterProductsDataByUserArgs = {
  productIds: Array<Scalars['Int']['input']>;
  siteCode: Array<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA001BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA006BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA027BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA077BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA112BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA113BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA524BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoA525BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoB378BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoB719BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchCategoryInfoB956BySomeoneArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchManyCategoryInfoA077BySomeoneArgs = {
  code: Array<Scalars['String']['input']>;
};


export type QuerySelectMyOrderByUserArgs = {
  cursor?: InputMaybe<OrderWhereUniqueInput>;
  orderBy?: InputMaybe<Array<OrderOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderWhereInput>;
};


export type QuerySelectMyProductByAdminArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectMyProductByUserArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectMyProductsCountByUserArgs = {
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectNoticeByEveryoneArgs = {
  noticeId: Scalars['Int']['input'];
};


export type QuerySelectNoticeCountByAdminArgs = {
  where?: InputMaybe<NoticeWhereInput>;
};


export type QuerySelectNoticesByEveryoneArgs = {
  cursor?: InputMaybe<NoticeWhereUniqueInput>;
  orderBy?: InputMaybe<Array<NoticeOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NoticeWhereInput>;
};


export type QuerySelectPlanInfosForEveryoneArgs = {
  cursor?: InputMaybe<PlanInfoWhereUniqueInput>;
  orderBy?: InputMaybe<Array<PlanInfoOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PlanInfoWhereInput>;
};


export type QuerySelectProductsByAdminArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectProductsBySomeoneArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectProductsCountByAdminArgs = {
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectProductsCountBySomeoneArgs = {
  where?: InputMaybe<ProductWhereInput>;
};


export type QuerySelectSiilInfoBySomeoneArgs = {
  code: Scalars['String']['input'];
};


export type QuerySelectTaobaoProductsByAdminArgs = {
  cursor?: InputMaybe<TaobaoProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<TaobaoProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TaobaoProductWhereInput>;
};


export type QuerySelectTaobaoProductsByUserArgs = {
  cursor?: InputMaybe<TaobaoProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<TaobaoProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TaobaoProductWhereInput>;
};


export type QuerySelectTaobaoProductsCountByAdminArgs = {
  where?: InputMaybe<TaobaoProductWhereInput>;
};


export type QuerySelectUserQuestionBySomeoneArgs = {
  cursor?: InputMaybe<UserQuestionWhereUniqueInput>;
  orderBy?: InputMaybe<Array<UserQuestionOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserQuestionWhereInput>;
};


export type QuerySelectUserQuestionCountBySomeoneArgs = {
  where?: InputMaybe<UserQuestionWhereInput>;
};


export type QuerySelectUsersByAdminArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: InputMaybe<Array<UserOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserWhereInput>;
};


export type QuerySelectUsersCountByAdminArgs = {
  where?: InputMaybe<UserWhereInput>;
};


export type QuerySelectWordTablesBySomeoneArgs = {
  cursor?: InputMaybe<WordTableWhereUniqueInput>;
  orderBy?: InputMaybe<Array<WordTableOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WordTableWhereInput>;
};


export type QuerySeletExistPurchaseLogArgs = {
  email: Scalars['String']['input'];
};


export type QueryTranslateTextArgs = {
  engine?: TranslateEngineEnumType;
  text: Scalars['String']['input'];
};

export type SignInType = {
  __typename?: 'SignInType';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type SiilInput = {
  code: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type SiilItem = {
  __typename?: 'SiilItem';
  code: Scalars['String']['output'];
  inputType: SiilItemTypeEnum;
  name: Scalars['String']['output'];
  options?: Maybe<Array<Scalars['String']['output']>>;
};

export enum SiilItemTypeEnum {
  Input = 'INPUT',
  Select = 'SELECT',
  Yesno = 'YESNO'
}

export type SiilItems = {
  __typename?: 'SiilItems';
  data: Array<SiilItem>;
  description: Scalars['String']['output'];
};

export type SiilSavedData = {
  __typename?: 'SiilSavedData';
  code: Scalars['String']['output'];
  data: Array<SiilSavedItem>;
};

export type SiilSavedItem = {
  __typename?: 'SiilSavedItem';
  code: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type SillInfoA001 = {
  __typename?: 'SillInfoA001';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA001OrderByWithRelationInput = {
  categoryInfoA001?: InputMaybe<CategoryInfoA001OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA001WhereInput = {
  AND?: InputMaybe<Array<SillInfoA001WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA001WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA001WhereInput>>;
  categoryInfoA001?: InputMaybe<CategoryInfoA001ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoA006 = {
  __typename?: 'SillInfoA006';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA006OrderByWithRelationInput = {
  categoryInfoA006?: InputMaybe<CategoryInfoA006OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA006WhereInput = {
  AND?: InputMaybe<Array<SillInfoA006WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA006WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA006WhereInput>>;
  categoryInfoA006?: InputMaybe<CategoryInfoA006ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoA027 = {
  __typename?: 'SillInfoA027';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA027OrderByWithRelationInput = {
  categoryInfoA027?: InputMaybe<CategoryInfoA027OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA027WhereInput = {
  AND?: InputMaybe<Array<SillInfoA027WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA027WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA027WhereInput>>;
  categoryInfoA027?: InputMaybe<CategoryInfoA027ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoA077 = {
  __typename?: 'SillInfoA077';
  activeSillDataA001: Array<SillInfoA001>;
  activeSillDataA006: Array<SillInfoA006>;
  activeSillDataA027: Array<SillInfoA027>;
  activeSillDataA077: Array<SillInfoA077>;
  activeSillDataA112: Array<SillInfoA112>;
  activeSillDataA113: Array<SillInfoA113>;
  activeSillDataA524: Array<SillInfoA524>;
  activeSillDataA525: Array<SillInfoA525>;
  activeSillDataB378: Array<SillInfoB378>;
  activeSillDataB719: Array<SillInfoB719>;
  activeSillDataB956: Array<SillInfoB956>;
  code: Scalars['String']['output'];
  codeA001?: Maybe<Scalars['String']['output']>;
  codeA006?: Maybe<Scalars['String']['output']>;
  codeA027?: Maybe<Scalars['String']['output']>;
  codeA112?: Maybe<Scalars['String']['output']>;
  codeA113?: Maybe<Scalars['String']['output']>;
  codeA524?: Maybe<Scalars['String']['output']>;
  codeA525?: Maybe<Scalars['String']['output']>;
  codeB378?: Maybe<Scalars['String']['output']>;
  codeB719?: Maybe<Scalars['String']['output']>;
  codeB956?: Maybe<Scalars['String']['output']>;
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  sillInfoA001?: Maybe<SillInfoA001>;
  sillInfoA006?: Maybe<SillInfoA006>;
  sillInfoA027?: Maybe<SillInfoA027>;
  sillInfoA112?: Maybe<SillInfoA112>;
  sillInfoA113?: Maybe<SillInfoA113>;
  sillInfoA524?: Maybe<SillInfoA524>;
  sillInfoA525?: Maybe<SillInfoA525>;
  sillInfoB378?: Maybe<SillInfoB378>;
  sillInfoB719?: Maybe<SillInfoB719>;
  sillInfoB956?: Maybe<SillInfoB956>;
};

export type SillInfoA077ListRelationFilter = {
  every?: InputMaybe<SillInfoA077WhereInput>;
  none?: InputMaybe<SillInfoA077WhereInput>;
  some?: InputMaybe<SillInfoA077WhereInput>;
};

export type SillInfoA077OrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type SillInfoA077OrderByWithRelationInput = {
  categoryInfoA077?: InputMaybe<CategoryInfoA077OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  codeA001?: InputMaybe<SortOrder>;
  codeA006?: InputMaybe<SortOrder>;
  codeA027?: InputMaybe<SortOrder>;
  codeA112?: InputMaybe<SortOrder>;
  codeA113?: InputMaybe<SortOrder>;
  codeA524?: InputMaybe<SortOrder>;
  codeA525?: InputMaybe<SortOrder>;
  codeB378?: InputMaybe<SortOrder>;
  codeB719?: InputMaybe<SortOrder>;
  codeB956?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA001?: InputMaybe<SillInfoA001OrderByWithRelationInput>;
  sillInfoA006?: InputMaybe<SillInfoA006OrderByWithRelationInput>;
  sillInfoA027?: InputMaybe<SillInfoA027OrderByWithRelationInput>;
  sillInfoA112?: InputMaybe<SillInfoA112OrderByWithRelationInput>;
  sillInfoA113?: InputMaybe<SillInfoA113OrderByWithRelationInput>;
  sillInfoA524?: InputMaybe<SillInfoA524OrderByWithRelationInput>;
  sillInfoA525?: InputMaybe<SillInfoA525OrderByWithRelationInput>;
  sillInfoB378?: InputMaybe<SillInfoB378OrderByWithRelationInput>;
  sillInfoB719?: InputMaybe<SillInfoB719OrderByWithRelationInput>;
  sillInfoB956?: InputMaybe<SillInfoB956OrderByWithRelationInput>;
};

export type SillInfoA077WhereInput = {
  AND?: InputMaybe<Array<SillInfoA077WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA077WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA077WhereInput>>;
  categoryInfoA077?: InputMaybe<CategoryInfoA077ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  codeA001?: InputMaybe<StringNullableFilter>;
  codeA006?: InputMaybe<StringNullableFilter>;
  codeA027?: InputMaybe<StringNullableFilter>;
  codeA112?: InputMaybe<StringNullableFilter>;
  codeA113?: InputMaybe<StringNullableFilter>;
  codeA524?: InputMaybe<StringNullableFilter>;
  codeA525?: InputMaybe<StringNullableFilter>;
  codeB378?: InputMaybe<StringNullableFilter>;
  codeB719?: InputMaybe<StringNullableFilter>;
  codeB956?: InputMaybe<StringNullableFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA001?: InputMaybe<SillInfoA001WhereInput>;
  sillInfoA006?: InputMaybe<SillInfoA006WhereInput>;
  sillInfoA027?: InputMaybe<SillInfoA027WhereInput>;
  sillInfoA112?: InputMaybe<SillInfoA112WhereInput>;
  sillInfoA113?: InputMaybe<SillInfoA113WhereInput>;
  sillInfoA524?: InputMaybe<SillInfoA524WhereInput>;
  sillInfoA525?: InputMaybe<SillInfoA525WhereInput>;
  sillInfoB378?: InputMaybe<SillInfoB378WhereInput>;
  sillInfoB719?: InputMaybe<SillInfoB719WhereInput>;
  sillInfoB956?: InputMaybe<SillInfoB956WhereInput>;
};

export type SillInfoA112 = {
  __typename?: 'SillInfoA112';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA112OrderByWithRelationInput = {
  categoryInfoA112?: InputMaybe<CategoryInfoA112OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA112WhereInput = {
  AND?: InputMaybe<Array<SillInfoA112WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA112WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA112WhereInput>>;
  categoryInfoA112?: InputMaybe<CategoryInfoA112ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoA113 = {
  __typename?: 'SillInfoA113';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA113OrderByWithRelationInput = {
  categoryInfoA113?: InputMaybe<CategoryInfoA113OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA113WhereInput = {
  AND?: InputMaybe<Array<SillInfoA113WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA113WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA113WhereInput>>;
  categoryInfoA113?: InputMaybe<CategoryInfoA113ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoA524 = {
  __typename?: 'SillInfoA524';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA524OrderByWithRelationInput = {
  categoryInfoA524?: InputMaybe<CategoryInfoA524OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA524WhereInput = {
  AND?: InputMaybe<Array<SillInfoA524WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA524WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA524WhereInput>>;
  categoryInfoA524?: InputMaybe<CategoryInfoA524ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoA525 = {
  __typename?: 'SillInfoA525';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoA525OrderByWithRelationInput = {
  categoryInfoA525?: InputMaybe<CategoryInfoA525OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoA525WhereInput = {
  AND?: InputMaybe<Array<SillInfoA525WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoA525WhereInput>>;
  OR?: InputMaybe<Array<SillInfoA525WhereInput>>;
  categoryInfoA525?: InputMaybe<CategoryInfoA525ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoB378 = {
  __typename?: 'SillInfoB378';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoB378OrderByWithRelationInput = {
  categoryInfoB378?: InputMaybe<CategoryInfoB378OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoB378WhereInput = {
  AND?: InputMaybe<Array<SillInfoB378WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoB378WhereInput>>;
  OR?: InputMaybe<Array<SillInfoB378WhereInput>>;
  categoryInfoB378?: InputMaybe<CategoryInfoB378ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoB719 = {
  __typename?: 'SillInfoB719';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoB719OrderByWithRelationInput = {
  categoryInfoB719?: InputMaybe<CategoryInfoB719OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoB719WhereInput = {
  AND?: InputMaybe<Array<SillInfoB719WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoB719WhereInput>>;
  OR?: InputMaybe<Array<SillInfoB719WhereInput>>;
  categoryInfoB719?: InputMaybe<CategoryInfoB719ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export type SillInfoB956 = {
  __typename?: 'SillInfoB956';
  code: Scalars['String']['output'];
  data: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SillInfoB956OrderByWithRelationInput = {
  categoryInfoB956?: InputMaybe<CategoryInfoB956OrderByRelationAggregateInput>;
  code?: InputMaybe<SortOrder>;
  data?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sillInfoA077?: InputMaybe<SillInfoA077OrderByRelationAggregateInput>;
};

export type SillInfoB956WhereInput = {
  AND?: InputMaybe<Array<SillInfoB956WhereInput>>;
  NOT?: InputMaybe<Array<SillInfoB956WhereInput>>;
  OR?: InputMaybe<Array<SillInfoB956WhereInput>>;
  categoryInfoB956?: InputMaybe<CategoryInfoB956ListRelationFilter>;
  code?: InputMaybe<StringFilter>;
  data?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  sillInfoA077?: InputMaybe<SillInfoA077ListRelationFilter>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  subscribeUserEvent?: Maybe<UserLog>;
};

export enum TaobaoItemOrderBy {
  /** 판매자 신용 순 */
  Credit = 'CREDIT',
  /** 판매량순 */
  Sale = 'SALE'
}

export type TaobaoProduct = {
  __typename?: 'TaobaoProduct';
  brand: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  imageThumbnail: Scalars['String']['output'];
  modifiedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  originalData: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  product: Array<Product>;
  shopName?: Maybe<Scalars['String']['output']>;
  taobaoBrandId?: Maybe<Scalars['String']['output']>;
  taobaoCategoryId: Scalars['String']['output'];
  taobaoNumIid: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  videoUrl?: Maybe<Scalars['String']['output']>;
};


export type TaobaoProductProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type TaobaoProductOption = {
  __typename?: 'TaobaoProductOption';
  name: Scalars['String']['output'];
  taobaoSkuId: Scalars['String']['output'];
};

export type TaobaoProductOptionInfo = {
  __typename?: 'TaobaoProductOptionInfo';
  option: Array<TaobaoProductOption>;
  optionName: Array<TaobaoProductOptionName>;
  optionValue: Array<TaobaoProductOptionValue>;
};

export type TaobaoProductOptionName = {
  __typename?: 'TaobaoProductOptionName';
  name: Scalars['String']['output'];
  taobaoPid: Scalars['String']['output'];
};

export type TaobaoProductOptionValue = {
  __typename?: 'TaobaoProductOptionValue';
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  taobaoVid: Scalars['String']['output'];
};

export type TaobaoProductOrderByWithRelationInput = {
  brand?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  imageThumbnail?: InputMaybe<SortOrder>;
  modifiedAt?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  originalData?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  shopName?: InputMaybe<SortOrder>;
  taobaoBrandId?: InputMaybe<SortOrder>;
  taobaoCategoryId?: InputMaybe<SortOrder>;
  taobaoNumIid?: InputMaybe<SortOrder>;
  translateData?: InputMaybe<SortOrder>;
  url?: InputMaybe<SortOrder>;
  videoUrl?: InputMaybe<SortOrder>;
};

export type TaobaoProductWhereInput = {
  AND?: InputMaybe<Array<TaobaoProductWhereInput>>;
  NOT?: InputMaybe<Array<TaobaoProductWhereInput>>;
  OR?: InputMaybe<Array<TaobaoProductWhereInput>>;
  brand?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  imageThumbnail?: InputMaybe<StringFilter>;
  modifiedAt?: InputMaybe<DateTimeFilter>;
  name?: InputMaybe<StringFilter>;
  originalData?: InputMaybe<StringFilter>;
  price?: InputMaybe<FloatFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  shopName?: InputMaybe<StringNullableFilter>;
  taobaoBrandId?: InputMaybe<StringNullableFilter>;
  taobaoCategoryId?: InputMaybe<StringFilter>;
  taobaoNumIid?: InputMaybe<StringFilter>;
  translateData?: InputMaybe<StringNullableFilter>;
  url?: InputMaybe<StringNullableFilter>;
  videoUrl?: InputMaybe<StringNullableFilter>;
};

export type TaobaoProductWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export enum TranslateEngineEnumType {
  Baidu = 'BAIDU',
  Google = 'GOOGLE',
  Papago = 'PAPAGO'
}

export enum TranslateTargetEnumType {
  /** 상품 전체 일괄번역,id:Product */
  ProductAll = 'PRODUCT_ALL',
  /** 상품 이름 번역,id:Product */
  ProductName = 'PRODUCT_NAME',
  /** 상품 옵션 일괄번역,id:ProductOptionName */
  ProductOptionAll = 'PRODUCT_OPTION_ALL',
  /** 상품 옵션 이름 번역,id:ProductOptionName */
  ProductOptionName = 'PRODUCT_OPTION_NAME',
  /** 상품 옵션별 이름 번역,id:ProductOptionValue */
  ProductOptionValue = 'PRODUCT_OPTION_VALUE'
}

export type UpdateCategoryInfoA077MatchingByAdminInput = {
  categoryChanges: Array<CategoryChangeInput>;
  shopCode: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  connectedUsers: Array<User>;
  createdAt: Scalars['DateTime']['output'];
  createdToken?: Maybe<Scalars['DateTime']['output']>;
  credit: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  kakaoId?: Maybe<Scalars['String']['output']>;
  keywardMemo?: Maybe<Scalars['String']['output']>;
  master: Scalars['Int']['output'];
  masterUserId?: Maybe<Scalars['Int']['output']>;
  naverId?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  product: Array<Product>;
  productCount: Scalars['Int']['output'];
  purchaseInfo: UserPurchaseInfo;
  purchaseInfo2: UserPurchaseInfo;
  refAvailable: Scalars['Boolean']['output'];
  refCode?: Maybe<Scalars['String']['output']>;
  state: UserState;
  token?: Maybe<Scalars['String']['output']>;
  userInfo?: Maybe<UserInfo>;
  userLog: Array<UserLog>;
  verificationNumber: Scalars['String']['output'];
};


export type UserProductArgs = {
  cursor?: InputMaybe<ProductWhereUniqueInput>;
  orderBy?: InputMaybe<Array<ProductOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductWhereInput>;
};


export type UserUserLogArgs = {
  cursor?: InputMaybe<UserLogWhereUniqueInput>;
  orderBy?: InputMaybe<Array<UserLogOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserLogWhereInput>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  additionalShippingFeeJeju: Scalars['Int']['output'];
  asInformation?: Maybe<Scalars['String']['output']>;
  asTel?: Maybe<Scalars['String']['output']>;
  auctionFee: Scalars['Float']['output'];
  auctionUseType: Scalars['String']['output'];
  autoPrice: Scalars['String']['output'];
  calculateWonType: Scalars['String']['output'];
  cnyRate: Scalars['Float']['output'];
  cnyRateDollar: Scalars['Float']['output'];
  cnyRateEuro: Scalars['Float']['output'];
  cnyRateYen: Scalars['Float']['output'];
  collectCheckPosition?: Maybe<Scalars['String']['output']>;
  collectStock: Scalars['Int']['output'];
  collectTimeout: Scalars['Int']['output'];
  coupangAccessKey: Scalars['String']['output'];
  coupangDefaultInbound: Scalars['String']['output'];
  coupangDefaultOutbound: Scalars['String']['output'];
  coupangFee: Scalars['Float']['output'];
  coupangImageOpt: Scalars['String']['output'];
  coupangLoginId: Scalars['String']['output'];
  coupangMaximumBuyForPerson: Scalars['Int']['output'];
  coupangOutboundShippingTimeDay: Scalars['Int']['output'];
  coupangSecretKey: Scalars['String']['output'];
  coupangUnionDeliveryType: Scalars['String']['output'];
  coupangUseType: Scalars['String']['output'];
  coupangVendorId: Scalars['String']['output'];
  defaultPrice: Scalars['String']['output'];
  defaultShippingFee: Scalars['Int']['output'];
  descriptionShowTitle: Scalars['String']['output'];
  discountAmount?: Maybe<Scalars['Int']['output']>;
  discountUnitType?: Maybe<Scalars['String']['output']>;
  esmplusAuctionId: Scalars['String']['output'];
  esmplusGmarketId: Scalars['String']['output'];
  esmplusMasterId: Scalars['String']['output'];
  exchangeShippingFee: Scalars['Int']['output'];
  extraShippingFee: Scalars['Int']['output'];
  fixImageBottom?: Maybe<Scalars['String']['output']>;
  fixImageSubBottom?: Maybe<Scalars['String']['output']>;
  fixImageSubTop?: Maybe<Scalars['String']['output']>;
  fixImageTop?: Maybe<Scalars['String']['output']>;
  gmarketFee: Scalars['Float']['output'];
  gmarketUseType: Scalars['String']['output'];
  interparkCertKey: Scalars['String']['output'];
  interparkEditCertKey: Scalars['String']['output'];
  interparkEditSecretKey: Scalars['String']['output'];
  interparkFee: Scalars['Float']['output'];
  interparkSecretKey: Scalars['String']['output'];
  interparkUseType: Scalars['String']['output'];
  lotteonApiKey: Scalars['String']['output'];
  lotteonFee: Scalars['Float']['output'];
  lotteonNormalFee: Scalars['Float']['output'];
  lotteonNormalUseType: Scalars['String']['output'];
  lotteonSellerType: Scalars['String']['output'];
  lotteonUseType?: Maybe<Scalars['String']['output']>;
  lotteonVendorId: Scalars['String']['output'];
  marginRate: Scalars['Float']['output'];
  marginUnitType?: Maybe<Scalars['String']['output']>;
  maxProductLimit?: Maybe<Scalars['Int']['output']>;
  naverAutoSearchTag: Scalars['String']['output'];
  naverFee: Scalars['Float']['output'];
  naverOrigin: Scalars['String']['output'];
  naverOriginCode: Scalars['String']['output'];
  naverStoreOnly: Scalars['String']['output'];
  naverStoreUrl: Scalars['String']['output'];
  naverUseType: Scalars['String']['output'];
  optionAlignTop: Scalars['String']['output'];
  optionIndexType: Scalars['Int']['output'];
  optionTwoWays: Scalars['String']['output'];
  orderToDeliveryMembership: Scalars['String']['output'];
  orderToDeliveryMethod: Scalars['String']['output'];
  orderToDeliveryName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  productCollectCount: Scalars['Int']['output'];
  refundShippingFee: Scalars['Int']['output'];
  sellerCatId?: Maybe<Scalars['String']['output']>;
  sillFromCategory?: Maybe<Scalars['String']['output']>;
  streetApiKey: Scalars['String']['output'];
  streetApiKey2: Scalars['String']['output'];
  streetApiKey3: Scalars['String']['output'];
  streetApiKey4: Scalars['String']['output'];
  streetApiMemo: Scalars['String']['output'];
  streetApiMemo2: Scalars['String']['output'];
  streetApiMemo3: Scalars['String']['output'];
  streetApiMemo4: Scalars['String']['output'];
  streetDefaultInbound: Scalars['String']['output'];
  streetDefaultOutbound: Scalars['String']['output'];
  streetFee: Scalars['Float']['output'];
  streetNormalApiKey: Scalars['String']['output'];
  streetNormalApiKey2: Scalars['String']['output'];
  streetNormalApiKey3: Scalars['String']['output'];
  streetNormalApiKey4: Scalars['String']['output'];
  streetNormalApiMemo: Scalars['String']['output'];
  streetNormalApiMemo2: Scalars['String']['output'];
  streetNormalApiMemo3: Scalars['String']['output'];
  streetNormalApiMemo4: Scalars['String']['output'];
  streetNormalFee: Scalars['Float']['output'];
  streetNormalInbound?: Maybe<Scalars['String']['output']>;
  streetNormalOutbound?: Maybe<Scalars['String']['output']>;
  streetNormalUseKeyType: Scalars['String']['output'];
  streetNormalUseType: Scalars['String']['output'];
  streetUseKeyType: Scalars['String']['output'];
  streetUseType: Scalars['String']['output'];
  thumbnailRepresentNo?: Maybe<Scalars['String']['output']>;
  tmonFee: Scalars['Float']['output'];
  tmonId?: Maybe<Scalars['String']['output']>;
  tmonUseType: Scalars['String']['output'];
  useDetailInformation: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
  wemakepriceFee: Scalars['Float']['output'];
  wemakepriceId: Scalars['String']['output'];
  wemakepriceUseType: Scalars['String']['output'];
};

export type UserInfoOrderByWithRelationInput = {
  additionalShippingFeeJeju?: InputMaybe<SortOrder>;
  asInformation?: InputMaybe<SortOrder>;
  asTel?: InputMaybe<SortOrder>;
  auctionFee?: InputMaybe<SortOrder>;
  auctionUseType?: InputMaybe<SortOrder>;
  autoPrice?: InputMaybe<SortOrder>;
  calculateWonType?: InputMaybe<SortOrder>;
  cnyRate?: InputMaybe<SortOrder>;
  cnyRateDollar?: InputMaybe<SortOrder>;
  cnyRateEuro?: InputMaybe<SortOrder>;
  cnyRateYen?: InputMaybe<SortOrder>;
  collectCheckPosition?: InputMaybe<SortOrder>;
  collectStock?: InputMaybe<SortOrder>;
  collectTimeout?: InputMaybe<SortOrder>;
  coupangAccessKey?: InputMaybe<SortOrder>;
  coupangDefaultInbound?: InputMaybe<SortOrder>;
  coupangDefaultOutbound?: InputMaybe<SortOrder>;
  coupangFee?: InputMaybe<SortOrder>;
  coupangImageOpt?: InputMaybe<SortOrder>;
  coupangLoginId?: InputMaybe<SortOrder>;
  coupangMaximumBuyForPerson?: InputMaybe<SortOrder>;
  coupangOutboundShippingTimeDay?: InputMaybe<SortOrder>;
  coupangSecretKey?: InputMaybe<SortOrder>;
  coupangUnionDeliveryType?: InputMaybe<SortOrder>;
  coupangUseType?: InputMaybe<SortOrder>;
  coupangVendorId?: InputMaybe<SortOrder>;
  defaultPrice?: InputMaybe<SortOrder>;
  defaultShippingFee?: InputMaybe<SortOrder>;
  descriptionShowTitle?: InputMaybe<SortOrder>;
  discountAmount?: InputMaybe<SortOrder>;
  discountUnitType?: InputMaybe<SortOrder>;
  esmplusAuctionId?: InputMaybe<SortOrder>;
  esmplusGmarketId?: InputMaybe<SortOrder>;
  esmplusMasterId?: InputMaybe<SortOrder>;
  exchangeShippingFee?: InputMaybe<SortOrder>;
  extraShippingFee?: InputMaybe<SortOrder>;
  fixImageBottom?: InputMaybe<SortOrder>;
  fixImageSubBottom?: InputMaybe<SortOrder>;
  fixImageSubTop?: InputMaybe<SortOrder>;
  fixImageTop?: InputMaybe<SortOrder>;
  gmarketFee?: InputMaybe<SortOrder>;
  gmarketUseType?: InputMaybe<SortOrder>;
  interparkCertKey?: InputMaybe<SortOrder>;
  interparkEditCertKey?: InputMaybe<SortOrder>;
  interparkEditSecretKey?: InputMaybe<SortOrder>;
  interparkFee?: InputMaybe<SortOrder>;
  interparkSecretKey?: InputMaybe<SortOrder>;
  interparkUseType?: InputMaybe<SortOrder>;
  lotteonApiKey?: InputMaybe<SortOrder>;
  lotteonFee?: InputMaybe<SortOrder>;
  lotteonNormalFee?: InputMaybe<SortOrder>;
  lotteonNormalUseType?: InputMaybe<SortOrder>;
  lotteonSellerType?: InputMaybe<SortOrder>;
  lotteonUseType?: InputMaybe<SortOrder>;
  lotteonVendorId?: InputMaybe<SortOrder>;
  marginRate?: InputMaybe<SortOrder>;
  marginUnitType?: InputMaybe<SortOrder>;
  maxProductLimit?: InputMaybe<SortOrder>;
  naverAutoSearchTag?: InputMaybe<SortOrder>;
  naverFee?: InputMaybe<SortOrder>;
  naverOrigin?: InputMaybe<SortOrder>;
  naverOriginCode?: InputMaybe<SortOrder>;
  naverStoreOnly?: InputMaybe<SortOrder>;
  naverStoreUrl?: InputMaybe<SortOrder>;
  naverUseType?: InputMaybe<SortOrder>;
  optionAlignTop?: InputMaybe<SortOrder>;
  optionIndexType?: InputMaybe<SortOrder>;
  optionTwoWays?: InputMaybe<SortOrder>;
  orderToDeliveryMembership?: InputMaybe<SortOrder>;
  orderToDeliveryMethod?: InputMaybe<SortOrder>;
  orderToDeliveryName?: InputMaybe<SortOrder>;
  phone?: InputMaybe<SortOrder>;
  productCollectCount?: InputMaybe<SortOrder>;
  refundShippingFee?: InputMaybe<SortOrder>;
  sellerCatId?: InputMaybe<SortOrder>;
  sillFromCategory?: InputMaybe<SortOrder>;
  streetApiKey?: InputMaybe<SortOrder>;
  streetApiKey2?: InputMaybe<SortOrder>;
  streetApiKey3?: InputMaybe<SortOrder>;
  streetApiKey4?: InputMaybe<SortOrder>;
  streetApiMemo?: InputMaybe<SortOrder>;
  streetApiMemo2?: InputMaybe<SortOrder>;
  streetApiMemo3?: InputMaybe<SortOrder>;
  streetApiMemo4?: InputMaybe<SortOrder>;
  streetDefaultInbound?: InputMaybe<SortOrder>;
  streetDefaultOutbound?: InputMaybe<SortOrder>;
  streetFee?: InputMaybe<SortOrder>;
  streetNormalApiKey?: InputMaybe<SortOrder>;
  streetNormalApiKey2?: InputMaybe<SortOrder>;
  streetNormalApiKey3?: InputMaybe<SortOrder>;
  streetNormalApiKey4?: InputMaybe<SortOrder>;
  streetNormalApiMemo?: InputMaybe<SortOrder>;
  streetNormalApiMemo2?: InputMaybe<SortOrder>;
  streetNormalApiMemo3?: InputMaybe<SortOrder>;
  streetNormalApiMemo4?: InputMaybe<SortOrder>;
  streetNormalFee?: InputMaybe<SortOrder>;
  streetNormalInbound?: InputMaybe<SortOrder>;
  streetNormalOutbound?: InputMaybe<SortOrder>;
  streetNormalUseKeyType?: InputMaybe<SortOrder>;
  streetNormalUseType?: InputMaybe<SortOrder>;
  streetUseKeyType?: InputMaybe<SortOrder>;
  streetUseType?: InputMaybe<SortOrder>;
  thumbnailRepresentNo?: InputMaybe<SortOrder>;
  tmonFee?: InputMaybe<SortOrder>;
  tmonId?: InputMaybe<SortOrder>;
  tmonUseType?: InputMaybe<SortOrder>;
  useDetailInformation?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
  wemakepriceFee?: InputMaybe<SortOrder>;
  wemakepriceId?: InputMaybe<SortOrder>;
  wemakepriceUseType?: InputMaybe<SortOrder>;
};

export type UserInfoWhereInput = {
  AND?: InputMaybe<Array<UserInfoWhereInput>>;
  NOT?: InputMaybe<Array<UserInfoWhereInput>>;
  OR?: InputMaybe<Array<UserInfoWhereInput>>;
  additionalShippingFeeJeju?: InputMaybe<IntFilter>;
  asInformation?: InputMaybe<StringNullableFilter>;
  asTel?: InputMaybe<StringNullableFilter>;
  auctionFee?: InputMaybe<FloatFilter>;
  auctionUseType?: InputMaybe<StringFilter>;
  autoPrice?: InputMaybe<StringFilter>;
  calculateWonType?: InputMaybe<StringFilter>;
  cnyRate?: InputMaybe<FloatFilter>;
  cnyRateDollar?: InputMaybe<FloatFilter>;
  cnyRateEuro?: InputMaybe<FloatFilter>;
  cnyRateYen?: InputMaybe<FloatFilter>;
  collectCheckPosition?: InputMaybe<StringNullableFilter>;
  collectStock?: InputMaybe<IntFilter>;
  collectTimeout?: InputMaybe<IntFilter>;
  coupangAccessKey?: InputMaybe<StringFilter>;
  coupangDefaultInbound?: InputMaybe<StringFilter>;
  coupangDefaultOutbound?: InputMaybe<StringFilter>;
  coupangFee?: InputMaybe<FloatFilter>;
  coupangImageOpt?: InputMaybe<StringFilter>;
  coupangLoginId?: InputMaybe<StringFilter>;
  coupangMaximumBuyForPerson?: InputMaybe<IntFilter>;
  coupangOutboundShippingTimeDay?: InputMaybe<IntFilter>;
  coupangSecretKey?: InputMaybe<StringFilter>;
  coupangUnionDeliveryType?: InputMaybe<StringFilter>;
  coupangUseType?: InputMaybe<StringFilter>;
  coupangVendorId?: InputMaybe<StringFilter>;
  defaultPrice?: InputMaybe<StringFilter>;
  defaultShippingFee?: InputMaybe<IntFilter>;
  descriptionShowTitle?: InputMaybe<StringFilter>;
  discountAmount?: InputMaybe<IntNullableFilter>;
  discountUnitType?: InputMaybe<StringNullableFilter>;
  esmplusAuctionId?: InputMaybe<StringFilter>;
  esmplusGmarketId?: InputMaybe<StringFilter>;
  esmplusMasterId?: InputMaybe<StringFilter>;
  exchangeShippingFee?: InputMaybe<IntFilter>;
  extraShippingFee?: InputMaybe<IntFilter>;
  fixImageBottom?: InputMaybe<StringNullableFilter>;
  fixImageSubBottom?: InputMaybe<StringNullableFilter>;
  fixImageSubTop?: InputMaybe<StringNullableFilter>;
  fixImageTop?: InputMaybe<StringNullableFilter>;
  gmarketFee?: InputMaybe<FloatFilter>;
  gmarketUseType?: InputMaybe<StringFilter>;
  interparkCertKey?: InputMaybe<StringFilter>;
  interparkEditCertKey?: InputMaybe<StringFilter>;
  interparkEditSecretKey?: InputMaybe<StringFilter>;
  interparkFee?: InputMaybe<FloatFilter>;
  interparkSecretKey?: InputMaybe<StringFilter>;
  interparkUseType?: InputMaybe<StringFilter>;
  lotteonApiKey?: InputMaybe<StringFilter>;
  lotteonFee?: InputMaybe<FloatFilter>;
  lotteonNormalFee?: InputMaybe<FloatFilter>;
  lotteonNormalUseType?: InputMaybe<StringFilter>;
  lotteonSellerType?: InputMaybe<StringFilter>;
  lotteonUseType?: InputMaybe<StringNullableFilter>;
  lotteonVendorId?: InputMaybe<StringFilter>;
  marginRate?: InputMaybe<FloatFilter>;
  marginUnitType?: InputMaybe<StringNullableFilter>;
  maxProductLimit?: InputMaybe<IntNullableFilter>;
  naverAutoSearchTag?: InputMaybe<StringFilter>;
  naverFee?: InputMaybe<FloatFilter>;
  naverOrigin?: InputMaybe<StringFilter>;
  naverOriginCode?: InputMaybe<StringFilter>;
  naverStoreOnly?: InputMaybe<StringFilter>;
  naverStoreUrl?: InputMaybe<StringFilter>;
  naverUseType?: InputMaybe<StringFilter>;
  optionAlignTop?: InputMaybe<StringFilter>;
  optionIndexType?: InputMaybe<IntFilter>;
  optionTwoWays?: InputMaybe<StringFilter>;
  orderToDeliveryMembership?: InputMaybe<StringFilter>;
  orderToDeliveryMethod?: InputMaybe<StringFilter>;
  orderToDeliveryName?: InputMaybe<StringFilter>;
  phone?: InputMaybe<StringNullableFilter>;
  productCollectCount?: InputMaybe<IntFilter>;
  refundShippingFee?: InputMaybe<IntFilter>;
  sellerCatId?: InputMaybe<StringNullableFilter>;
  sillFromCategory?: InputMaybe<StringNullableFilter>;
  streetApiKey?: InputMaybe<StringFilter>;
  streetApiKey2?: InputMaybe<StringFilter>;
  streetApiKey3?: InputMaybe<StringFilter>;
  streetApiKey4?: InputMaybe<StringFilter>;
  streetApiMemo?: InputMaybe<StringFilter>;
  streetApiMemo2?: InputMaybe<StringFilter>;
  streetApiMemo3?: InputMaybe<StringFilter>;
  streetApiMemo4?: InputMaybe<StringFilter>;
  streetDefaultInbound?: InputMaybe<StringFilter>;
  streetDefaultOutbound?: InputMaybe<StringFilter>;
  streetFee?: InputMaybe<FloatFilter>;
  streetNormalApiKey?: InputMaybe<StringFilter>;
  streetNormalApiKey2?: InputMaybe<StringFilter>;
  streetNormalApiKey3?: InputMaybe<StringFilter>;
  streetNormalApiKey4?: InputMaybe<StringFilter>;
  streetNormalApiMemo?: InputMaybe<StringFilter>;
  streetNormalApiMemo2?: InputMaybe<StringFilter>;
  streetNormalApiMemo3?: InputMaybe<StringFilter>;
  streetNormalApiMemo4?: InputMaybe<StringFilter>;
  streetNormalFee?: InputMaybe<FloatFilter>;
  streetNormalInbound?: InputMaybe<StringNullableFilter>;
  streetNormalOutbound?: InputMaybe<StringNullableFilter>;
  streetNormalUseKeyType?: InputMaybe<StringFilter>;
  streetNormalUseType?: InputMaybe<StringFilter>;
  streetUseKeyType?: InputMaybe<StringFilter>;
  streetUseType?: InputMaybe<StringFilter>;
  thumbnailRepresentNo?: InputMaybe<StringNullableFilter>;
  tmonFee?: InputMaybe<FloatFilter>;
  tmonId?: InputMaybe<StringNullableFilter>;
  tmonUseType?: InputMaybe<StringFilter>;
  useDetailInformation?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
  wemakepriceFee?: InputMaybe<FloatFilter>;
  wemakepriceId?: InputMaybe<StringFilter>;
  wemakepriceUseType?: InputMaybe<StringFilter>;
};

export type UserLog = {
  __typename?: 'UserLog';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isRead: Scalars['Boolean']['output'];
  payloadData: Scalars['String']['output'];
  title: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type UserLogListRelationFilter = {
  every?: InputMaybe<UserLogWhereInput>;
  none?: InputMaybe<UserLogWhereInput>;
  some?: InputMaybe<UserLogWhereInput>;
};

export type UserLogOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type UserLogOrderByWithRelationInput = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isRead?: InputMaybe<SortOrder>;
  payloadData?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export type UserLogWhereInput = {
  AND?: InputMaybe<Array<UserLogWhereInput>>;
  NOT?: InputMaybe<Array<UserLogWhereInput>>;
  OR?: InputMaybe<Array<UserLogWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  isRead?: InputMaybe<BoolFilter>;
  payloadData?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
};

export type UserLogWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export enum UserLoginType {
  Admin = 'ADMIN',
  Email = 'EMAIL',
  Kakao = 'KAKAO',
  Naver = 'NAVER'
}

export type UserOrderByWithRelationInput = {
  createdAt?: InputMaybe<SortOrder>;
  createdToken?: InputMaybe<SortOrder>;
  credit?: InputMaybe<SortOrder>;
  email?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  kakaoId?: InputMaybe<SortOrder>;
  keywardMemo?: InputMaybe<SortOrder>;
  master?: InputMaybe<SortOrder>;
  masterUserId?: InputMaybe<SortOrder>;
  naverId?: InputMaybe<SortOrder>;
  order?: InputMaybe<OrderOrderByRelationAggregateInput>;
  password?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  productStore?: InputMaybe<ProductStoreOrderByRelationAggregateInput>;
  purchaseLog?: InputMaybe<PurchaseLogOrderByRelationAggregateInput>;
  refAvailable?: InputMaybe<SortOrder>;
  refCode?: InputMaybe<SortOrder>;
  state?: InputMaybe<SortOrder>;
  token?: InputMaybe<SortOrder>;
  userInfo?: InputMaybe<UserInfoOrderByWithRelationInput>;
  userLog?: InputMaybe<UserLogOrderByRelationAggregateInput>;
  userQuestion?: InputMaybe<UserQuestionOrderByRelationAggregateInput>;
  verificationNumber?: InputMaybe<SortOrder>;
  wordTable?: InputMaybe<WordTableOrderByRelationAggregateInput>;
};

export type UserPurchaseAdditionalInfo = {
  __typename?: 'UserPurchaseAdditionalInfo';
  expiredAt: Scalars['DateTime']['output'];
  type: UserPurchaseAdditionalInfoEnumType;
};

export enum UserPurchaseAdditionalInfoEnumType {
  ImageTranslate = 'IMAGE_TRANSLATE',
  Stock = 'STOCK'
}

export type UserPurchaseInfo = {
  __typename?: 'UserPurchaseInfo';
  additionalInfo: Array<UserPurchaseAdditionalInfo>;
  history: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  levelExpiredAt: Scalars['DateTime']['output'];
};

export type UserQuestion = {
  __typename?: 'UserQuestion';
  answer?: Maybe<Scalars['String']['output']>;
  answeredAt?: Maybe<Scalars['DateTime']['output']>;
  attachmentFile?: Maybe<Scalars['String']['output']>;
  attachmentFiles: Array<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type UserQuestionListRelationFilter = {
  every?: InputMaybe<UserQuestionWhereInput>;
  none?: InputMaybe<UserQuestionWhereInput>;
  some?: InputMaybe<UserQuestionWhereInput>;
};

export type UserQuestionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type UserQuestionOrderByWithRelationInput = {
  answer?: InputMaybe<SortOrder>;
  answeredAt?: InputMaybe<SortOrder>;
  attachmentFile?: InputMaybe<SortOrder>;
  content?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isActive?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export type UserQuestionWhereInput = {
  AND?: InputMaybe<Array<UserQuestionWhereInput>>;
  NOT?: InputMaybe<Array<UserQuestionWhereInput>>;
  OR?: InputMaybe<Array<UserQuestionWhereInput>>;
  answer?: InputMaybe<StringNullableFilter>;
  answeredAt?: InputMaybe<DateTimeNullableFilter>;
  attachmentFile?: InputMaybe<StringNullableFilter>;
  content?: InputMaybe<StringFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  isActive?: InputMaybe<BoolFilter>;
  title?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
};

export type UserQuestionWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export enum UserSocialType {
  Email = 'EMAIL',
  Kakao = 'KAKAO',
  Naver = 'NAVER'
}

export enum UserState {
  Active = 'ACTIVE',
  Deleted = 'DELETED'
}

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  createdToken?: InputMaybe<DateTimeNullableFilter>;
  credit?: InputMaybe<IntFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  kakaoId?: InputMaybe<StringNullableFilter>;
  keywardMemo?: InputMaybe<StringNullableFilter>;
  master?: InputMaybe<IntFilter>;
  masterUserId?: InputMaybe<IntNullableFilter>;
  naverId?: InputMaybe<StringNullableFilter>;
  order?: InputMaybe<OrderListRelationFilter>;
  password?: InputMaybe<StringFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  productStore?: InputMaybe<ProductStoreListRelationFilter>;
  purchaseLog?: InputMaybe<PurchaseLogListRelationFilter>;
  refAvailable?: InputMaybe<BoolFilter>;
  refCode?: InputMaybe<StringNullableFilter>;
  state?: InputMaybe<EnumUserStateFilter>;
  token?: InputMaybe<StringNullableFilter>;
  userInfo?: InputMaybe<UserInfoWhereInput>;
  userLog?: InputMaybe<UserLogListRelationFilter>;
  userQuestion?: InputMaybe<UserQuestionListRelationFilter>;
  verificationNumber?: InputMaybe<StringFilter>;
  wordTable?: InputMaybe<WordTableListRelationFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  kakaoId?: InputMaybe<Scalars['String']['input']>;
  naverId?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export type WordTable = {
  __typename?: 'WordTable';
  findWord: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  replaceWord?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type WordTableListRelationFilter = {
  every?: InputMaybe<WordTableWhereInput>;
  none?: InputMaybe<WordTableWhereInput>;
  some?: InputMaybe<WordTableWhereInput>;
};

export type WordTableOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type WordTableOrderByWithRelationInput = {
  findWord?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  replaceWord?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export type WordTableUq_Word_Table_WordCompoundUniqueInput = {
  findWord: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type WordTableWhereInput = {
  AND?: InputMaybe<Array<WordTableWhereInput>>;
  NOT?: InputMaybe<Array<WordTableWhereInput>>;
  OR?: InputMaybe<Array<WordTableWhereInput>>;
  findWord?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  replaceWord?: InputMaybe<StringNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
};

export type WordTableWhereUniqueInput = {
  UQ_word_table_word?: InputMaybe<WordTableUq_Word_Table_WordCompoundUniqueInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type NewOrderInput = {
  deliveryFeeAmt: Scalars['Int']['input'];
  individualCustomUniqueCode?: InputMaybe<Scalars['String']['input']>;
  marketCode: Scalars['String']['input'];
  orderMemberName: Scalars['String']['input'];
  orderMemberTelNo: Scalars['String']['input'];
  orderNo: Scalars['String']['input'];
  orderQuantity: Scalars['Int']['input'];
  productName: Scalars['String']['input'];
  productOptionContents?: InputMaybe<Scalars['String']['input']>;
  productOrderMemo?: InputMaybe<Scalars['String']['input']>;
  productPayAmt: Scalars['Int']['input'];
  receiverIntegratedAddress: Scalars['String']['input'];
  receiverName: Scalars['String']['input'];
  receiverTelNo1: Scalars['String']['input'];
  receiverZipCode: Scalars['String']['input'];
  sellerProductManagementCode?: InputMaybe<Scalars['String']['input']>;
  taobaoOrderNo?: InputMaybe<Scalars['String']['input']>;
};

export type Order = {
  __typename?: 'order';
  deliveryFeeAmt: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  individualCustomUniqueCode?: Maybe<Scalars['String']['output']>;
  marketCode: Scalars['String']['output'];
  orderMemberName: Scalars['String']['output'];
  orderMemberTelNo: Scalars['String']['output'];
  orderNo: Scalars['String']['output'];
  orderQuantity: Scalars['Int']['output'];
  orderStateEnum: OrderStateEnum;
  productId?: Maybe<Scalars['Int']['output']>;
  productName: Scalars['String']['output'];
  productOptionContents?: Maybe<Scalars['String']['output']>;
  productOrderMemo?: Maybe<Scalars['String']['output']>;
  productPayAmt: Scalars['Int']['output'];
  receiverIntegratedAddress: Scalars['String']['output'];
  receiverName: Scalars['String']['output'];
  receiverTelNo1: Scalars['String']['output'];
  receiverZipCode: Scalars['String']['output'];
  sellerProductManagementCode?: Maybe<Scalars['String']['output']>;
  state: Scalars['Int']['output'];
  taobaoOrderNo?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
};

export type OrderMarketCode_UniqueCompoundUniqueInput = {
  marketCode: Scalars['String']['input'];
  orderNo: Scalars['String']['input'];
};

export type OrderOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type OrderOrderByWithRelationInput = {
  deliveryFeeAmt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  individualCustomUniqueCode?: InputMaybe<SortOrder>;
  marketCode?: InputMaybe<SortOrder>;
  orderMemberName?: InputMaybe<SortOrder>;
  orderMemberTelNo?: InputMaybe<SortOrder>;
  orderNo?: InputMaybe<SortOrder>;
  orderQuantity?: InputMaybe<SortOrder>;
  orderStateEnum?: InputMaybe<OrderStateEnumOrderByWithRelationInput>;
  productId?: InputMaybe<SortOrder>;
  productName?: InputMaybe<SortOrder>;
  productOptionContents?: InputMaybe<SortOrder>;
  productOrderMemo?: InputMaybe<SortOrder>;
  productPayAmt?: InputMaybe<SortOrder>;
  receiverIntegratedAddress?: InputMaybe<SortOrder>;
  receiverName?: InputMaybe<SortOrder>;
  receiverTelNo1?: InputMaybe<SortOrder>;
  receiverZipCode?: InputMaybe<SortOrder>;
  sellerProductManagementCode?: InputMaybe<SortOrder>;
  state?: InputMaybe<SortOrder>;
  taobaoOrderNo?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
};

export type OrderStateEnum = {
  __typename?: 'orderStateEnum';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type OrderStateEnumOrderByWithRelationInput = {
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  order?: InputMaybe<OrderOrderByRelationAggregateInput>;
};

export type OrderStateEnumWhereInput = {
  AND?: InputMaybe<Array<OrderStateEnumWhereInput>>;
  NOT?: InputMaybe<Array<OrderStateEnumWhereInput>>;
  OR?: InputMaybe<Array<OrderStateEnumWhereInput>>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringFilter>;
  order?: InputMaybe<OrderListRelationFilter>;
};

export type OrderWhereInput = {
  AND?: InputMaybe<Array<OrderWhereInput>>;
  NOT?: InputMaybe<Array<OrderWhereInput>>;
  OR?: InputMaybe<Array<OrderWhereInput>>;
  deliveryFeeAmt?: InputMaybe<IntFilter>;
  id?: InputMaybe<IntFilter>;
  individualCustomUniqueCode?: InputMaybe<StringNullableFilter>;
  marketCode?: InputMaybe<StringFilter>;
  orderMemberName?: InputMaybe<StringFilter>;
  orderMemberTelNo?: InputMaybe<StringFilter>;
  orderNo?: InputMaybe<StringFilter>;
  orderQuantity?: InputMaybe<IntFilter>;
  orderStateEnum?: InputMaybe<OrderStateEnumWhereInput>;
  productId?: InputMaybe<IntNullableFilter>;
  productName?: InputMaybe<StringFilter>;
  productOptionContents?: InputMaybe<StringNullableFilter>;
  productOrderMemo?: InputMaybe<StringNullableFilter>;
  productPayAmt?: InputMaybe<IntFilter>;
  receiverIntegratedAddress?: InputMaybe<StringFilter>;
  receiverName?: InputMaybe<StringFilter>;
  receiverTelNo1?: InputMaybe<StringFilter>;
  receiverZipCode?: InputMaybe<StringFilter>;
  sellerProductManagementCode?: InputMaybe<StringNullableFilter>;
  state?: InputMaybe<IntFilter>;
  taobaoOrderNo?: InputMaybe<StringNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<IntFilter>;
};

export type OrderWhereUniqueInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  marketCode_UNIQUE?: InputMaybe<OrderMarketCode_UniqueCompoundUniqueInput>;
};

export type ProductStateEnum = {
  __typename?: 'productStateEnum';
  id: Scalars['Int']['output'];
  state?: Maybe<Scalars['String']['output']>;
};

export type ProductStateEnumOrderByWithRelationInput = {
  id?: InputMaybe<SortOrder>;
  product?: InputMaybe<ProductOrderByRelationAggregateInput>;
  state?: InputMaybe<SortOrder>;
};

export type ProductStateEnumWhereInput = {
  AND?: InputMaybe<Array<ProductStateEnumWhereInput>>;
  NOT?: InputMaybe<Array<ProductStateEnumWhereInput>>;
  OR?: InputMaybe<Array<ProductStateEnumWhereInput>>;
  id?: InputMaybe<IntFilter>;
  product?: InputMaybe<ProductListRelationFilter>;
  state?: InputMaybe<StringNullableFilter>;
};

export type ProductStoreLogEnum = {
  __typename?: 'productStoreLogEnum';
  id: Scalars['Int']['output'];
  state?: Maybe<Scalars['String']['output']>;
};

export type ProductStoreLogEnumOrderByWithRelationInput = {
  id?: InputMaybe<SortOrder>;
  productStoreLog?: InputMaybe<ProductStoreLogOrderByRelationAggregateInput>;
  state?: InputMaybe<SortOrder>;
};

export type ProductStoreLogEnumWhereInput = {
  AND?: InputMaybe<Array<ProductStoreLogEnumWhereInput>>;
  NOT?: InputMaybe<Array<ProductStoreLogEnumWhereInput>>;
  OR?: InputMaybe<Array<ProductStoreLogEnumWhereInput>>;
  id?: InputMaybe<IntFilter>;
  productStoreLog?: InputMaybe<ProductStoreLogListRelationFilter>;
  state?: InputMaybe<StringNullableFilter>;
};

export type ProductViewLog = {
  __typename?: 'productViewLog';
  clientIp: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  productStoreId: Scalars['Int']['output'];
  siteCode: Scalars['String']['output'];
  viewTime: Scalars['DateTime']['output'];
};

export type ProductViewLogOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
  count?: InputMaybe<SortOrder>;
};

export type ProductViewLogWhereInput = {
  AND?: InputMaybe<Array<ProductViewLogWhereInput>>;
  NOT?: InputMaybe<Array<ProductViewLogWhereInput>>;
  OR?: InputMaybe<Array<ProductViewLogWhereInput>>;
  clientIp?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  product?: InputMaybe<ProductWhereInput>;
  productId?: InputMaybe<IntFilter>;
  productStoreId?: InputMaybe<IntFilter>;
  product_store?: InputMaybe<ProductStoreWhereInput>;
  siteCode?: InputMaybe<StringFilter>;
  userId?: InputMaybe<IntFilter>;
  viewTime?: InputMaybe<DateTimeFilter>;
};

export type PurchaseInputs = {
  expiredAt: Scalars['DateTime']['input'];
  planInfoId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type SetProductOption = {
  defaultShippingFee: Scalars['Int']['input'];
  isActive: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  optionString: Scalars['String']['input'];
  optionValue1Id: Scalars['Int']['input'];
  optionValue2Id?: InputMaybe<Scalars['Int']['input']>;
  optionValue3Id?: InputMaybe<Scalars['Int']['input']>;
  optionValue4Id?: InputMaybe<Scalars['Int']['input']>;
  optionValue5Id?: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Int']['input'];
  priceCny: Scalars['Float']['input'];
  productId: Scalars['Int']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
  taobaoSkuId: Scalars['String']['input'];
};

export type SillCodeInput = {
  categoryCode: Scalars['String']['input'];
  sillCode: Scalars['String']['input'];
};

export type TestType = {
  __typename?: 'testType';
  optionvalues?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  productId?: Maybe<Scalars['Int']['output']>;
  thumbnails?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};
