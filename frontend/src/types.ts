export type User = {
    id: string
    username: string
    email: string
    first_name: string
    last_name: string
    created_at: string
}

export type FishEntry = {
    id: string
    species: string
    location: string
    length_in: number | null
    weight_lb: number | null
    bait: string | null
    rig: string | null
    notes: string | null
    caught_at: string | null
    created_at: string
  };