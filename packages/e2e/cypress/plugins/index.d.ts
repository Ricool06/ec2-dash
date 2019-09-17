import { CloudFormation } from 'aws-sdk';

export interface FluentFilterBy {
  by(filters: string[]): CloudFormation.Export[];
}

export interface FluentMapIntoObject {
  intoObject(obj: any, deploymentStage: string): { [key: string]: string };
}

export interface FluentWithKeys {
  withKeys(keys: string[]): FluentMapIntoObject;
}

export type filterExports = (exports: CloudFormation.Export[]) => FluentFilterBy;

export type mapExports = (exports: CloudFormation.Export[]) => FluentMapIntoObject;

// export type getCloudFormationExports = (arg: { deploymentStage: string, exportFilters: string[] }) => { [key: string]: string };