// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.12;

import "./HederaResponseCodes.sol";
import "./IHederaTokenService.sol";

abstract contract HederaTokenService is HederaResponseCodes {

    address constant precompileAddress = address(0x167);

    /**
     * @dev associate the specified token with the specified account
     *
     * @param account account to assoicate with the token
     * @param token token to associate
     *
     * @return responseCode response code
     */
    function associateToken(address account, address token) internal returns (int32 responseCode) {
        (bool success, bytes memory result) = precompileAddress.call(
            abi.encodeWithSelector(IHederaTokenService.associateToken.selector,
            account, token));
        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;
    }
   
    
    /**
     * @dev Transfers tokens where the calling account/contract is implicitly the first entry in the token transfer list,
     * where the amount is the value needed to zero balance the transfers. Regular signing rules apply for sending
     * (positive amount) or receiving (negative amount)
     *
     * @param token The token to transfer to/from
     * @param sender The sender for the transaction
     * @param receiver The receiver of the transaction
     * @param amount Non-negative value to send. a negative value will result in a failure.
     * 
     * @return responseCode response code
     */
    function transferToken(address token, address sender, address receiver, int64 amount) internal
        returns (int32 responseCode)
    {
        (bool success, bytes memory result) = precompileAddress.call(
            abi.encodeWithSelector(IHederaTokenService.transferToken.selector,
            token, sender, receiver, amount));
        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;
    }
}
