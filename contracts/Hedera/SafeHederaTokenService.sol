// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.12;

import "./HederaTokenService.sol";

abstract contract SafeHederaTokenService is HederaTokenService {

    function safeAssociateToken(address account, address token) internal {
        int32 responseCode;
        (responseCode) = HederaTokenService.associateToken(account, token);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe single association failed!");
    }

    function safeTransferToken(address token, address sender, address receiver, int64 amount) internal {
        int32 responseCode;
        (responseCode) = HederaTokenService.transferToken(token, sender, receiver, amount);
        require(responseCode == HederaResponseCodes.SUCCESS, "Safe token transfer failed!");
    }
}
