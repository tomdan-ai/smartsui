module smartsui::nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{String};
    use sui::url::{Self, Url};

    struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        creator: address,
    }

    public entry fun mint(
        name: String,
        description: String,
        url: String,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = NFT {
            id: object::new(ctx),
            name,
            description,
            url: url::new_unsafe(url),
            creator: sender,
        };
        
        transfer::transfer(nft, sender);
    }

    // Additional NFT functions will be added here
}