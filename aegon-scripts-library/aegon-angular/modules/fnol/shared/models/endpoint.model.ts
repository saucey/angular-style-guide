export type EndpointType = 'phone' | 'link' | 'download';

export interface Endpoint {
    id: string,
    type: EndpointType,
    data?: any
}

export interface PhoneEndpoint extends Endpoint {
    data: {
        phone: string
    }
}

export interface LinkEndpoint extends Endpoint {
    data: {
        url: string
    }
}

export interface DownloadEndpoint extends Endpoint {
    data: {
        file: string
    }
}



