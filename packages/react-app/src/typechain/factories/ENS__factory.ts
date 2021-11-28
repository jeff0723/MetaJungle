/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ENS, ENSInterface } from "../ENS";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "resolver",
    outputs: [
      {
        internalType: "contract Resolver",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ENS__factory {
  static readonly abi = _abi;
  static createInterface(): ENSInterface {
    return new utils.Interface(_abi) as ENSInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ENS {
    return new Contract(address, _abi, signerOrProvider) as ENS;
  }
}