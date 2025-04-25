
export interface ContentTypes {
    _id?:string,
    title:string,
    link:string,
    description:string,
    tags:string[],
    type : string
}

export interface ContentErrorTypes {
    title?: string;
    link?: string;
    description?: string;
    tags?: string;
    type?: string;
  }
  