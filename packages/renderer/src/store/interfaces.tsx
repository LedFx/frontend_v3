export interface controller {
    id: string
    base_config: {
        name: string
        framerate: number
    }
    active: boolean
}

export interface device {
    id?: string
    type?: string
    base_config: {
        name: string
        pixel_count: number
    }
    impl_config: Record<string, any>
    state?: deviceState
}

export interface effect {
    id: string
    type: string
    base_config: effectConfig
}

export enum deviceState {
    Disconnected,
    Connected,
    Disconnecting,
    Connecting,
}

export interface connections {
    devices: Record<string, string>
    effects: Record<string, string>
}

export interface effectConfig {
    background_brightness: number
    background_color: string
    blur: number
    brightness: number
    decay: number
    flip: boolean
    freq_max: number
    freq_min: number
    hue_shift: number
    intensity: number
    mirror: boolean
    palette: string
    saturation: number
}

export interface settings {
    host: string
    port: number
    noLogo: boolean
    noUpdate: boolean
    noTray: boolean
    noScan: boolean
    openUi: boolean
    logLevel: number
}

// Schema interfaces

export interface schema {
    effect: effectSchema
    device: deviceSchema
    controller: Record<string, schemaEntry>
    setting: Record<string, schemaEntry>
}

export interface effectInfo {
    description: string
    good_for: string[]
    category: string
    preview: string // todo
}

export interface deviceInfo {
    name: string
    info: string
    protocols: string[]
}

export interface schemaEntry {
    default: any
    description: string
    required: boolean
    title: string
    type: string
    validation: Record<string, any>
}

export interface effectSchema {
    base: Record<string, schemaEntry>
    types: Record<string, effectInfo>
}

export interface deviceSchema {
    base: Record<string, schemaEntry>
    impl: Record<string, schemaEntry>
    types: Record<string, deviceInfo>
}

// audio

export interface audioDevice {
    'id': string
    'hostapi': string
    'sample_rate': number
    'name': string
    'channels_in': number
    'channels_out': number
    'is_default': boolean
    'source': string
}