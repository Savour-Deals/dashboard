export default interface Business {
	id: string,
	businessName: string,
	address: string,
	presetMessages: string[],
	onboardMessage: string,
	stripeCustomerId?: string,
	stripePaymentMethod?: string,
	stripeSubId?: string,
	stripeRecurringSubItem?: string,
	stripeUsageSubItem?: string,
	messagingNumber?: string,
	subscriberMap: Map<string, SubscriberInfo>,
}

export interface SubscriberInfo {
	subscribed: boolean,
	timestamp: string
}

