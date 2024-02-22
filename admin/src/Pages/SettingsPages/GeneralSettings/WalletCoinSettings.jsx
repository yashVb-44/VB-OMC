import React from 'react'

const WalletCoinSettings = ({
    minWalletAmount,
    setMinWalletAmount,
    minCoinsAmount,
    setMinCoinsAmount,
    CoinsAmount,
    setCoinsAmount,
    setReviewAmount,
    reviewAmount,
    minWalletAmountforOrder,
    setMinWalletAmountforOrder,
    userOrderCoins,
    setUserOrderCoins,
    senderCoinsAtOrder,
    setSenderCoinsAtOrder,
    senderWalletAtOrder,
    setSenderWalletAtOrder,
    setUserrefferalcoins,
    userrefferalcoins,
    resellerOrderCoins,
    setResellerOrderCoins
}) => {
    return (
        <>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Minimum Amount for Add in wallet :-
                </label>
                <div className="col-md-10">
                    <input
                        min={1}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={minWalletAmount}
                        onChange={(e) => {
                            setMinWalletAmount(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Minimum Amount for coins withdrawal in wallet :-
                </label>
                <div className="col-md-10">
                    <input
                        min={1}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={minCoinsAmount}
                        onChange={(e) => {
                            setMinCoinsAmount(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Minus wallet balance for reseller to place order :-
                </label>
                <div className="col-md-10">
                    <input
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={minWalletAmountforOrder}
                        onChange={(e) => {
                            setMinWalletAmountforOrder(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Rating & Review reward coins :-
                </label>
                <div className="col-md-10">
                    <input
                        min={1}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={reviewAmount}
                        onChange={(e) => {
                            setReviewAmount(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Refer & Earn coins for reciver :- <br></br>
                    (For receiver)
                </label>
                <div className="col-md-10">
                    <input
                        min={1}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={userrefferalcoins}
                        onChange={(e) => {
                            setUserrefferalcoins(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Coins reward on first order completion of receiver :- <br></br>
                    (For sender)
                </label>
                <div className="col-md-10">
                    <input
                        min={0}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={senderCoinsAtOrder}
                        onChange={(e) => {
                            setSenderCoinsAtOrder(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Coins reward on order completion :- <br></br>
                    (For normal user) <br></br>
                    (note :- value in %)
                </label>
                <div className="col-md-10">
                    <input
                        min={0}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={userOrderCoins}
                        onChange={(e) => {
                            setUserOrderCoins(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Coins reward on order completion :- <br></br>
                    (For reseller) <br></br>
                    (note :- value in %)
                </label>
                <div className="col-md-10">
                    <input
                        min={0}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={resellerOrderCoins}
                        onChange={(e) => {
                            setResellerOrderCoins(e.target.value);
                        }}
                    />
                </div>
            </div>
            {/* <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Order Wallet Reward Amount :- <br></br>
                    (For sender)
                </label>
                <div className="col-md-10">
                    <input
                        min={0}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={senderWalletAtOrder}
                        onChange={(e) => {
                            setSenderWalletAtOrder(e.target.value);
                        }}
                    />
                </div>
            </div> */}
            <div className="mb-3 row">
                <label
                    htmlFor="example-text-input"
                    className="col-md-2 col-form-label"
                >
                    Amount Per Coin :- <br></br>
                    (ex. 2 coins = 1₹)
                </label>
                <div className="col-md-10">
                    <input
                        min={1}
                        className="form-control"
                        type="number"
                        id="example-number-input"
                        value={CoinsAmount}
                        onChange={(e) => {
                            setCoinsAmount(e.target.value);
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default WalletCoinSettings
