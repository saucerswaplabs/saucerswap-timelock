// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (finance/VestingWallet.sol)
pragma solidity 0.8.12;

import "./Hedera/SafeHederaTokenService.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Hedera TimeLock Contract
 * @dev This contract handles time locking Hedera Token Service tokens for a given beneficiary. Custody of only one token
 * can be given to this contract, which will release the token to the beneficiary once timestamp > _start.
 * The lock schedule is customizable through the {vestedAmount} function.
 *
 * Any token transferred to this contract will follow the lock schedule as if they were locked from the beginning.
 * Consequently, if the timelock has already started, any amount of tokens sent to this contract will (at least partly)
 * be immediately releasable.
 */

contract TokenTimeLock is SafeHederaTokenService, Ownable {

    event Released(uint256 amount);
    event BeneficiaryChanged(address beneficiary);

    // Released amount
    uint256 private _released;

    // Token address
    address private immutable _tokenAddr;

    // Beneficiary address
    address private _beneficiary;

    // Start time stamp
    uint256 private immutable _start;

    /**
     * @dev Set the beneficiary, start timestamp and vesting duration of the vesting wallet.
     * @param tokenAddr_ the address of the token to be timelocked
     * @param beneficiaryAddress_ the address the beneficiary of the locked tokens
     * @param lockDuration_ the number of seconds from contract creation to when tokens may be removed from this contract
     */
    constructor(
        address tokenAddr_,
        address beneficiaryAddress_,
        uint256 lockDuration_
    ) {
        require(beneficiaryAddress_ != address(0), "TimeLock: beneficiary is zero address");
        _beneficiary = beneficiaryAddress_;
        _start = block.timestamp + lockDuration_;
        _tokenAddr = tokenAddr_;

        safeAssociateToken(address(this), tokenAddr_);
    }

    /**
     * @dev Getter for the beneficiary address.
     */
    function beneficiary() external view virtual returns (address) {
        return _beneficiary;
    }

    /**
     * @dev Getter for the start timestamp.
     */
    function start() external view virtual returns (uint256) {
        return _start;
    }

    /**
     * @dev Getter for the token address
     */
    function tokenAddr() external view virtual returns (address) {
        return _tokenAddr;
    }

    /**
     * @dev Amount of token already released
     */
    function released() external view virtual returns (uint256) {
        return _released;
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {Released} event.
     */
    function release() external returns (uint256) {
        uint256 time = (block.timestamp);
        uint256 releasable = vestedAmount(block.timestamp) - _released;
        _released += releasable;
        
        if (releasable > 0) {
            safeTransferToken(_tokenAddr, address(this), _beneficiary, int64(int256(releasable)));
            emit Released(releasable);
        }
        return time;
    }

    /**
     * @dev Calculates the amount of tokens that has already vested, either 0 or entire contract balance of _tokenAddr.
     */
    function vestedAmount(uint256 timestamp) public view virtual returns (uint256) {
        return _vestingSchedule(IERC20(_tokenAddr).balanceOf(address(this)) + _released, timestamp);
    }

    /**
     * @dev Modified vesting schedule forumla to return 0 or entire allocation.
     */
    function _vestingSchedule(uint256 totalAllocation, uint256 timestamp) internal view virtual returns (uint256) {
        if (timestamp < _start) {
            return 0;
        } else {
            return totalAllocation;
        }
    }

    function setBeneficiary(address ben) external onlyOwner {
        require(ben != address(0), "TimeLock: beneficiary is the zero address");

        _beneficiary = ben;
        emit BeneficiaryChanged(ben);
    }
}
