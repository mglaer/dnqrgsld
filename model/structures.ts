export interface ExampleFlatNode {
  expandable: boolean;  
  name: string;
  level: number;
  TypeEntity: any;
  ID:number;
}

export interface FileItem {
  ID: string;
  ShortTitle: string;
  URL: string;
  Entities: string;
}


export interface NavItem {
  ShortTitle: string;
  iconName: string;
  route?: string;
  children?: NavItem[];
}

export interface VGroupsAndUsersStructureTree {
  ID: number;
  name: string;
  TypeEntity?: string;
  children?: VGroupsAndUsersStructureTree[];
}


export interface VUsers {
  ID: number,
  FirstName: string,
  LastName: string,
  MiddleName: string,
  Login: string,
  Phone:string,
  Email:string,
  Password: string,
  SecurityLevel: string,
  ArchiveSign: boolean,
  SecurityID: number
}

export class Users {
    constructor(
      public ID?: number,
      public FirstName?: string,
      public LastName?: string,
      public MiddleName?: string,
      public Login?: string,
      public Phone?:string,
      public Email?:string,
      public Password?: string,
      public Securitylevel?: number,
      public ArchiveSign?: boolean,
      public SecurityID?: number) {
    }
}

export interface Groups {
  ID: number;
  ShortTitle:string;
  Description:string;
  Parent:number;
  ArchiveSign:boolean;
  SecurityID:number;
  SecurityLevel:string;  
}

export interface VGroups {
  ID: number;
  ShortTitle:string;
  Description:string;
  SecurityLevel:string;
  ArchiveSign:boolean;
  SecurityID:number;
  Parent:number;
}

export interface Entities {
  ID: number;
  EntityStructure:number;
  ShortTitle:string;
  Description:string;
  OpenContent:string;
  PrivateContent:string;
  ArchiveSign:boolean;
  SecurityLevel:number;  
  SecurityID:number;
  TemplateSign:boolean;
  Template:number;
  URLPicture:string;
}

export interface VEntities {
  ID: number;
  EntityStructure:number;
  ShortTitle:string;
  Description:string;
  OpenContent:string;
  PrivateContent:string;
  ArchiveSign:boolean;
  SecurityLevel:string;  
  SecurityID:number;
  TemplateSign:boolean;
  Template:number;
  URLPicture:string;
}

export interface VMenusOperations {
  ID?: number;
  ShortTitle: string;
  Parent?: string;
  Type: string;
  NamePage:string;
}

export interface VMenusOperationsTree {
  ID?: number;
  ShortTitle: string;
  Parent?: string;
  Type: string;
  children?: VMenusOperationsTree[];
}

export interface VGroupsAndUsersStructure {
  ID: number,
  ShortTitle: string,
  Parent:any,
  ArchiveSign: boolean,
  TypeEntity: string,  
}

export interface SecurityLevel {
  ID?: number,
  ShortTitle: string,
  Level: number,
  Description: string,
}
//----------------------Ontology------------------------------
/*
export interface VEntityStructure {
  ID: number;
  Parent:number,
  ShortTitle: string,
  Description: string,
  ArchiveSign: boolean,
  SecurityLevel: string,  
  SecurityID: number,
  TypeElement: number,  
}*/

export interface VEntityStructureTree {
  ID: number;
  name: string;
  TypeElement?: string;
  children?: VEntityStructureTree[];
}

export interface OntologyFlatNode {
  expandable: boolean;  
  name: string;
  level: number;
  TypeElement: any;
  ID:number;
}

export interface VEntityStructure {
  ID: number;
  Parent:any;
  ShortTitle:string;
  Description:string;
  ArchiveSign:boolean;
  SecurityLevel:string;  
  SecurityID:number;
  TypeElement: string;
}
//--------------------------------------------------------------------------
//--Управление НТЗ---

export interface VPassportCSTP {
  ID: number;
  ShortTitle:string;
  ArchiveSign:boolean;
  SecurityLevel:string;  
  SecurityID:number;
  Goal:string;
  Type:string;
  DateInitiation:string;
  Document:string;
  Members:string;
  StartDate:string;
  EndDate:string;
  Costs:number;
}

export interface PassportCSTP {
  ID: number;
  ShortTitle:string;
  ArchiveSign:boolean;
  SecurityLevel:number;  
  SecurityID:number;
  Goal:string;
  Type:string;
  DateInitiation:string;
  Document:string;
  Members:string;
  StartDate:string;
  EndDate:string;
  Costs:number;
}
//-------------------------------------------------
export interface VTargeted {
  ID: number;
  PassportCSTP:number;
  TypeTargeted:string;
  Name:string;
  Volume:string;
}

export interface Targeted {
  ID: number;
  PassportCSTP:number;
  TypeTargeted:number;
  Name:string;
  Volume:string;
}
//--------------------------------------------------
export interface VTechnologyCSTP {
  ID: number;
  PassportCSTP:number;
  ShortTitle:string;
  ArchiveSign:boolean;
  SecurityLevel:string;  
  SecurityID:number;  
}

export interface TechnologyCSTP {
  ID: number;
  PassportCSTP:number;
  TechbologyPassport:number;  
}
//---
export interface VTechnologyPassportStructure {
  ID: number;
  ShortTitle:string;
  ArchiveSign:boolean;
  Parent:number,
  SecurityLevel:string;  
  SecurityID:number;  
  TypeElement:string;
}
//-------------------------------------------
export interface TechnologyPassport {
  ID: number;
  ShortTitle:string;
  ArchiveSign:boolean;
  EntityStructure:number,
  SecurityLevel:number;  
  Content:string,
  TemplateSign:boolean,
  SecurityID:number;  
  Template:number;
}
//--------------------------------------------
export interface VTechnologyPassport {
  ID: number;
  ShortTitle:string;
  ArchiveSign:boolean;
  EntityStructure:number;
  SecurityLevel:string;  
  Content:string;
  TemplateSign:boolean;
  SecurityID:number;  
  Template:number;
}
//--------------------------------------------
export interface ViewVTB {
  ID: number;
  ShortTitle:string;
  Description:string;
  Entities:number;
  SecurityLevel:number;  
  SecurityID:number;  
  Content:string;  
}
//--------------------------------------------
export interface VViewVTB {
  ID: number;
  ShortTitle:string;
  Description:string;
  Entities:number;
  SecurityLevel:string;  
  SecurityID:number;  
  Content:string;  
}
//---------------Red key-----------------------
export interface VProject {
  ID: number;
  ShortTitle:string;
  Description:string;
  SecurityLevel:string;  
  ArchiveSign:boolean;
}
//---------------------------------------------
export interface Project {
  ID: number;
  ShortTitle:string;
  Description:string;
  SecurityLevel:number;  
  ArchiveSign:boolean;
  SecurityID:number;
}
//---------------------------------------------
export interface VModule {
  ID: number;
  ShortTitle:string;
  Description:string;
  CommandLine:string;
  InputParameters:string;
  SecurityLevel:string;  
  ArchiveSign:boolean;
}
//---------------------------------------------
export interface Module {
  ID: number;
  ShortTitle:string;
  Description:string;
  CommandLine:string;
  InputParameters:string;
  SecurityLevel:number;  
  ArchiveSign:boolean;
  SecurityID:number;
}
//---------------------------------------------
export interface VCalculation {
  ID: number;
  ShortTitle:string;
  Description:string;
  ModuleID:number;
  Module:string;
  InOutFile:string;
  Project:number;
  Status:string;
  Path:string;  
}
//---------------------------------------------
export interface Calculation {
  ID: number;
  ShortTitle:string;
  Description:string;
  Project:number;
  Module:number;
  InOutFile:string;
  Status:string;
  Path:string;  
}
//---------------------------------------------

