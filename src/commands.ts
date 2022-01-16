export const commands = [
	{
		name: 'store',
		description: 'Get current Valorant store',
		options: [
			{
				type: 3,
				name: "username",
				description: "riot username",
				required: true
			},
			{
				type: 3,
				name: "password",
				description: "riot password",
				required: true
			}
		]
	},
	{
		name: 'valoloop',
		description: 'Get current Valorant store and loop every 7 am',
		options: [
			{
				type: 3,
				name: "username",
				description: "riot username",
				required: true
			},
			{
				type: 3,
				name: "password",
				description: "riot password",
				required: true
			}
		]
	},
	{
		name: 'valolist',
		description: 'Get Listing User'
	},
	{
		name: 'valoshop',
		description: 'Get Listing User',
		options: [
			{
				type: 3,
				name: "username",
				description: "riot username",
				required: true
			}
		]
	}
]