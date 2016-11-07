export type EndpointType = 'generic' | 'auto' | 'redirect'

export interface Endpoint {
    id: string,
    type: EndpointType
}

export interface GenericEndpoint extends Endpoint {
    data: {
        title: string,
        description: string,
        list?: {
            title: string,
            items: string[]
        },
        button: {
            phone?: string,
            link?: string,
        },
        alert?: boolean,
        bottomLink?: {
            text: string,
            url: string
        }
    }
}

export interface RedirectEndpoint extends Endpoint {
    data: {
        category: string
    }
}

export interface AutoEndpoint extends Endpoint {

}



