import {
    EventBridgeClient,
    PutRuleCommand,
    PutTargetsCommand,
    CreateConnectionCommand,
    CreateApiDestinationCommand,
} from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient();

/**
 * Schedule an EventBridge rule to send a JSON event to your API at a specific time.
 * @param auctionId - The ID of the auction.
 * @param endTime - The end time of the auction (Date).
 * @param apiUrl - The API endpoint to notify.
 * @param authToken - Authorization token for your API.
 */
async function scheduleAuctionEnd(
    auctionId: string,
    endTime: Date,
    apiUrl: string,
    authToken: string
) {
    try {
        const ruleName = `auction-end-${auctionId}`;
        const connectionName = `connection-auction-${auctionId}`;
        const destinationName = `destination-auction-${auctionId}`;

        // Step 1: Create a Connection for API authentication
        const connectionCommand = new CreateConnectionCommand({
            Name: connectionName,
            AuthorizationType: "API_KEY", // Adjust based on your API's auth type
            AuthParameters: {
                ApiKeyAuthParameters: {
                    ApiKeyName: "Authorization", // Name of the header
                    ApiKeyValue: authToken, // The token value
                }
            },
        });
        const connectionResponse = await client.send(connectionCommand);
        const connectionArn = connectionResponse.ConnectionArn;
        console.log(`Connection created: ${connectionArn}`);

        // Step 2: Create an API Destination
        const destinationCommand = new CreateApiDestinationCommand({
            Name: destinationName,
            ConnectionArn: connectionArn,
            InvocationEndpoint: apiUrl,
            HttpMethod: "POST",
        });
        const destinationResponse = await client.send(destinationCommand);
        const destinationArn = destinationResponse.ApiDestinationArn;
        console.log(`API Destination created: ${destinationArn}`);


        // Extract components for the cron expression
        const minutes = endTime.getUTCMinutes();
        const hours = endTime.getUTCHours();
        const dayOfMonth = endTime.getUTCDate();
        const month = endTime.getUTCMonth() + 1; // months are 0-based in JavaScript, so add 1
        const year = endTime.getUTCFullYear();
        const cronExpression = `cron(${minutes} ${hours} ${dayOfMonth} ${month} ? ${year})`;

        // Step 3: Create an EventBridge Rule
        const ruleCommand = new PutRuleCommand({
            Name: ruleName,
            ScheduleExpression: cronExpression,
            State: "ENABLED",
        });
        const ruleResponse = await client.send(ruleCommand);
        console.log(`Rule created: ${ruleResponse.RuleArn}`);

        // Step 4: Add a target to the rule
        const targetCommand = new PutTargetsCommand({
            Rule: ruleName,
            Targets: [
                {
                    Id: `target-auction-${auctionId}`,
                    Arn: destinationArn, 
                    RoleArn: "arn:aws:iam::490004645027:role/aws-service-role/apidestinations.events.amazonaws.com/AWSServiceRoleForAmazonEventBridgeApiDestinations",
                    Input: JSON.stringify({
                        auction_id: auctionId,
                        action: "END_AUCTION",
                    }),
                },
            ],
        });
        await client.send(targetCommand);
        console.log(`Target added to rule: ${ruleName}`);
    } catch (error) {
        console.error("Error scheduling auction end:", error);
    }
}

export default { scheduleAuctionEnd };