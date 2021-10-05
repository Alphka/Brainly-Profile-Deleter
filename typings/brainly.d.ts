export interface GetUserByIdData {
	avatar: {
		medium: string
		small: string
	} | null
	avatar_id: number | null
	category: number
	client_type: number
	current_best_answers_count: number
	gender: number
	id: number
	is_deleted: boolean
	nick: string
	points: number
	primary_rank_id: number
	ranks_ids: number[]
	registration_date: string
}
