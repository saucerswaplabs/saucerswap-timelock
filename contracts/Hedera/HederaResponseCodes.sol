// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.12;

abstract contract HederaResponseCodes {
    // response codes
    int32 internal constant UNKNOWN = 21; // The responding node has submitted the transaction to the network. Its final status is still unknown.
    int32 internal constant SUCCESS = 22; // The transaction succeeded
}
