/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  PayableOverrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PaymentSplitter,
  PaymentSplitterInterface,
} from "../PaymentSplitter";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "payees",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "shares_",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "PayeeAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReleased",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "payee",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "account",
        type: "address",
      },
    ],
    name: "release",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "released",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "shares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalReleased",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405260405162000c0738038062000c078339810160408190526200002691620002a8565b8051825114620000535760405162461bcd60e51b81526004016200004a90620003e7565b60405180910390fd5b6000825111620000775760405162461bcd60e51b81526004016200004a9062000484565b60005b8251811015620000fb57620000e6838281518110620000a957634e487b7160e01b600052603260045260246000fd5b6020026020010151838381518110620000d257634e487b7160e01b600052603260045260246000fd5b60200260200101516200010460201b60201c565b80620000f2816200055f565b9150506200007a565b505050620005a9565b6001600160a01b0382166200012d5760405162461bcd60e51b81526004016200004a906200039b565b60008111620001505760405162461bcd60e51b81526004016200004a90620004bb565b6001600160a01b03821660009081526002602052604090205415620001895760405162461bcd60e51b81526004016200004a9062000439565b60048054600181019091557f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0180546001600160a01b0319166001600160a01b038416908117909155600090815260026020526040812082905554620001f190829062000544565b6000556040517f40c340f65e17194d14ddddb073d3c9f888e3cb52b5aae0c6c7706b4fbc905fac9062000228908490849062000382565b60405180910390a15050565b600082601f83011262000245578081fd5b815160206200025e62000258836200051e565b620004f2565b82815281810190858301838502870184018810156200027b578586fd5b855b858110156200029b578151845292840192908401906001016200027d565b5090979650505050505050565b60008060408385031215620002bb578182fd5b82516001600160401b0380821115620002d2578384fd5b818501915085601f830112620002e6578384fd5b81516020620002f962000258836200051e565b82815281810190858301838502870184018b101562000316578889fd5b8896505b848710156200034f5780516001600160a01b03811681146200033a57898afd5b8352600196909601959183019183016200031a565b509188015191965090935050508082111562000369578283fd5b50620003788582860162000234565b9150509250929050565b6001600160a01b03929092168252602082015260400190565b6020808252602c908201527f5061796d656e7453706c69747465723a206163636f756e74206973207468652060408201526b7a65726f206164647265737360a01b606082015260800190565b60208082526032908201527f5061796d656e7453706c69747465723a2070617965657320616e6420736861726040820152710cae640d8cadccee8d040dad2e6dac2e8c6d60731b606082015260800190565b6020808252602b908201527f5061796d656e7453706c69747465723a206163636f756e7420616c726561647960408201526a206861732073686172657360a81b606082015260800190565b6020808252601a908201527f5061796d656e7453706c69747465723a206e6f20706179656573000000000000604082015260600190565b6020808252601d908201527f5061796d656e7453706c69747465723a20736861726573206172652030000000604082015260600190565b6040518181016001600160401b038111828210171562000516576200051662000593565b604052919050565b60006001600160401b038211156200053a576200053a62000593565b5060209081020190565b600082198211156200055a576200055a6200057d565b500190565b60006000198214156200057657620005766200057d565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b61064e80620005b96000396000f3fe6080604052600436106100595760003560e01c806319165587146100a55780633a98ef39146100c75780638b83209b146100f25780639852595c1461011f578063ce7c2ac21461013f578063e33b7de31461015f576100a0565b366100a0577f6ef95f06320e7a25a04a175ca677b7052bdd97131872c2192525a629f51be770610087610174565b34604051610096929190610438565b60405180910390a1005b600080fd5b3480156100b157600080fd5b506100c56100c03660046103e6565b610178565b005b3480156100d357600080fd5b506100dc6102c5565b6040516100e99190610573565b60405180910390f35b3480156100fe57600080fd5b5061011261010d366004610409565b6102cb565b6040516100e99190610424565b34801561012b57600080fd5b506100dc61013a3660046103e6565b610309565b34801561014b57600080fd5b506100dc61015a3660046103e6565b610324565b34801561016b57600080fd5b506100dc61033f565b3390565b6001600160a01b0381166000908152600260205260409020546101b65760405162461bcd60e51b81526004016101ad90610451565b60405180910390fd5b6000600154476101c6919061057c565b6001600160a01b038316600090815260036020908152604080832054835460029093529083205493945091926101fc90856105b4565b6102069190610594565b61021091906105d3565b90508061022f5760405162461bcd60e51b81526004016101ad90610528565b6001600160a01b03831660009081526003602052604090205461025390829061057c565b6001600160a01b03841660009081526003602052604090205560015461027a90829061057c565b6001556102878382610345565b7fdf20fd1e76bc69d672e4814fafb2c449bba3a5369d8359adf9e05e6fde87b05683826040516102b8929190610438565b60405180910390a1505050565b60005490565b6000600482815481106102ee57634e487b7160e01b600052603260045260246000fd5b6000918252602090912001546001600160a01b031692915050565b6001600160a01b031660009081526003602052604090205490565b6001600160a01b031660009081526002602052604090205490565b60015490565b804710156103655760405162461bcd60e51b81526004016101ad906104f1565b6000826001600160a01b03168260405161037e90610421565b60006040518083038185875af1925050503d80600081146103bb576040519150601f19603f3d011682016040523d82523d6000602084013e6103c0565b606091505b50509050806103e15760405162461bcd60e51b81526004016101ad90610497565b505050565b6000602082840312156103f7578081fd5b813561040281610600565b9392505050565b60006020828403121561041a578081fd5b5035919050565b90565b6001600160a01b0391909116815260200190565b6001600160a01b03929092168252602082015260400190565b60208082526026908201527f5061796d656e7453706c69747465723a206163636f756e7420686173206e6f2060408201526573686172657360d01b606082015260800190565b6020808252603a908201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c20726040820152791958da5c1a595b9d081b585e481a185d99481c995d995c9d195960321b606082015260800190565b6020808252601d908201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604082015260600190565b6020808252602b908201527f5061796d656e7453706c69747465723a206163636f756e74206973206e6f742060408201526a191d59481c185e5b595b9d60aa1b606082015260800190565b90815260200190565b6000821982111561058f5761058f6105ea565b500190565b6000826105af57634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156105ce576105ce6105ea565b500290565b6000828210156105e5576105e56105ea565b500390565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b038116811461061557600080fd5b5056fea26469706673582212201926f0761aa145c4bac82a0bc0a8ba72ddd945c4bfacab6382afb267893fc37464736f6c63430008000033";

export class PaymentSplitter__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    payees: string[],
    shares_: BigNumberish[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<PaymentSplitter> {
    return super.deploy(
      payees,
      shares_,
      overrides || {}
    ) as Promise<PaymentSplitter>;
  }
  getDeployTransaction(
    payees: string[],
    shares_: BigNumberish[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(payees, shares_, overrides || {});
  }
  attach(address: string): PaymentSplitter {
    return super.attach(address) as PaymentSplitter;
  }
  connect(signer: Signer): PaymentSplitter__factory {
    return super.connect(signer) as PaymentSplitter__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PaymentSplitterInterface {
    return new utils.Interface(_abi) as PaymentSplitterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PaymentSplitter {
    return new Contract(address, _abi, signerOrProvider) as PaymentSplitter;
  }
}