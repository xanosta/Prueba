export interface AlertType {
  typeId: number;
  alertTypeCode: AlertTypeCode;
}

export enum AlertTypeCode {
  BAS_VH_DESC = 'BAS_VH_DESC',
  BAS_VH_ID_MAN = 'BAS_VH_ID_MAN',
  BAS_VH_ID_CORR = 'BAS_VH_ID_CORR',
  RE_DIF_TOL = 'RE_DIF_TOL',
  RE_SUP_MAX = 'RE_SUP_MAX',
  RE_DES_DIF = 'RE_DES_DIF',
  RE_DES_MAX = 'RE_DES_MAX',
  TR_DES_CON_ENT = 'TR_DES_CON_ENT',
  TR_DES_CON_SAL = 'TR_DES_CON_SAL',
  MA_VH_DES = 'MA_VH_DES',
  BAS_VH_RET = 'BAS_VH_RET',
  VE_TO_NE = 'VE_TO_NE',
  VE_TO_NPE = 'VE_TO_NPE',
  CO_NO_ENTRY = 'CO_NO_ENTRY',
  EXCESS_WEIGHT = 'EXCESS_WEIGHT',
}
