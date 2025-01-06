import AuctionService from '@services/AuctionService';
import UserService from '@services/UserService';
import AWS from 'aws-sdk';

import { SNS } from '@aws-sdk/client-sns';

// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
// AWS.config.update({ region: process.env.AWS_REGION });

const sns = new SNS();

/**
 * Ensures that an SNS topic exists, creating it if necessary.
 * @param auctionId - The ID of the auction (used as the topic name).
 * @returns The ARN of the topic.
 */
async function createAuctionTopicIfNotExist(auctionId: string): Promise<string> {
    const topicName = `auction_${auctionId}`;

    try {
        // Attempt to find the topic
        const { Topics } = await sns.listTopics();
        const topic = Topics?.find((t) => t.TopicArn?.endsWith(`:${topicName}`));

        if (topic) {
            console.log(`SNS topic for auction ${auctionId} already exists: ${topic.TopicArn}`);
            return topic.TopicArn!;
        }

        // Create the topic if it doesn't exist
        const { TopicArn } = await sns.createTopic({ Name: topicName });
        console.log(`SNS topic created for auction ${auctionId}: ${TopicArn}`);
        return TopicArn!;
    } catch (error) {
        console.error(`Failed to ensure topic for auction ${auctionId}:`, error);
        throw error;
    }
}


/**
 * Subscribes a user to the auction's SNS topic.
 * @param auctionId - The ID of the auction.
 * @param email - The email address of the subscriber.
 */
export async function subscribeUserToAuction(auctionId: string, userId: string): Promise<void> {
    try {
        const user = await UserService.getUserById(parseInt(userId));
        const email = user?.email;
        const topicArn = await createAuctionTopicIfNotExist(auctionId);

        const params = {
            Protocol: 'email', // Email protocol
            TopicArn: topicArn,
            Endpoint: email,
        };

        const result = await sns.subscribe(params);
        console.log(`Subscription initiated for ${email} to auction ${auctionId}: ${result.SubscriptionArn}`);
    } catch (error) {
        console.error(`Failed to subscribe user ${userId} to auction ${auctionId}:`, error);
        throw error;
    }
}


/**
 * Unsubscribes a user from the auction's SNS topic.
 * @param auctionId - The ID of the auction.
 * @param email - The email address of the subscriber.
 */
export async function unsubscribeUserFromAuction(auctionId: string, userId: string): Promise<void> {
    try {
        const user = await UserService.getUserById(parseInt(userId));
        const email = user?.email;
        const topicArn = await createAuctionTopicIfNotExist(auctionId);

        // List all subscriptions for the topic
        const { Subscriptions } = await sns.listSubscriptionsByTopic({ TopicArn: topicArn });

        if (!Subscriptions || Subscriptions.length === 0) {
            console.log(`No subscriptions found for topic ${auctionId}.`);
            return;
        }

        // Find the subscription for the given email
        const subscription = Subscriptions.find((sub) => sub.Endpoint === email);

        if (!subscription || !subscription.SubscriptionArn) {
            console.log(`No subscription found for email ${email} on auction ${auctionId}.`);
            return;
        }

        // Unsubscribe the user
        await sns.unsubscribe({ SubscriptionArn: subscription.SubscriptionArn });
        console.log(`Unsubscribed ${email} from auction ${auctionId}.`);
    } catch (error) {
        console.error(`Failed to unsubscribe user ${userId} from auction ${auctionId}:`, error);
    }
}



/**
 * Publishes a bid update to the auction's SNS topic.
 * @param auctionId - The ID of the auction.
 * @param bidAmount - The bid amount.
 * @param bidderId - The ID of the bidder.
 */
export async function publishBidUpdate(auctionId: string, bidAmount: number, bidderId: string): Promise<void> {
    try {
        const topicArn = await createAuctionTopicIfNotExist(auctionId);

        const auction = await AuctionService.getAuctionsById(parseInt(auctionId));
        const user = await UserService.getUserById(parseInt(bidderId));

        const params = {
            TopicArn: topicArn,
            Message: `A new bid has been placed on auction ${auction?.name}.\n` +
                `Bid Amount: $${bidAmount}\n` +
                `Bidder ID: ${user?.firstname} ${user?.lastname}\n` +
                `Check it out now! `,
            Subject: `New Bid on Auction ${auction?.name}`,
        };

        await sns.publish(params);
        console.log(`Bid update published to auction ${auctionId}`);
    } catch (error) {
        console.error(`Failed to publish bid update for auction ${auctionId}:`, error);
        throw error;
    }
}


export default { subscribeUserToAuction, unsubscribeUserFromAuction, publishBidUpdate };