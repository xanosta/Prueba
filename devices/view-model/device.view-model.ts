import { TreeNode } from 'primeng/api';

export interface DeviceTreeNode extends TreeNode {
  data: {
    id: number;
    name: string;
    type?: string;
    ip?: string;
    port?: number;
    power?: number;
    frequency?: number;
    level: number;
  };
  children?: DeviceTreeNode[];
}
