export interface ICreateProduct {
  title: string;
  file: string;
  is_warranty: boolean;
}

export interface IUpdateProduct {
  id: string;
  title: string;
  is_warranty: boolean;
}

export interface IDeleteProduct {
  id: string;
}

export enum statusClaim {
  PENDING = 'PENDING',
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
}

export interface IWarrantyClaim {
  id: string;
  status: statusClaim;
  created_by: string;
}

export interface IApprovalWarrantyClaim {
  id: string;
  status: statusClaim;
  claim_by: string;
  claim_at: Date;
}
