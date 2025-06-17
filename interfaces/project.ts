export interface Project {
    ID : number,
    ShortTitle: string,
    SecurityLevel: string,
    ArchiveSign: boolean,
    Description: string,
    StartDate: Date,
    EndDate: Date,
    Customer: string,
    Executor: string,
}
