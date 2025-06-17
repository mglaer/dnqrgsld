import { HttpClient, HttpEvent, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VPassportCSTP, PassportCSTP, VUsers, VViewVTB, VModule } from '../model/structures';
import { map } from 'rxjs/operators';
import { VGroupsAndUsersStructureTree, VMenusOperations, Users } from '../model/structures';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';

export interface FileItem {
  ID: string;
  ShortTitle: string;
  URL: string;
  Entities: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiurl_upload_file = environment.servers[environment.srv_mode].host + '/upload_file/';
  apiurl_download_file = environment.servers[environment.srv_mode].host + '/download_file/';
  apiurl_redkey_download_file = environment.servers[environment.srv_mode].host + '/redkey_download_file/';
  // Новые эндпоинты для главного изображения
  apiurl_upload_main_image = environment.servers[environment.srv_mode].host + '/upload_main_image';
  apiurl_download_main_image = environment.servers[environment.srv_mode].host + '/download_main_image/';

  private current_user: Users = new Users();
  AUTH_API: string = environment.servers[environment.srv_mode].host + '/auth/login/';
  //
  apiurl_users = environment.servers[environment.srv_mode].host + '/users';
  apiurl_menu = environment.servers[environment.srv_mode].host + '/root_menu';
  apiurl_groups_and_users = environment.servers[environment.srv_mode].host + '/get_groups_and_users';
  apiurl_update_user = environment.servers[environment.srv_mode].host + '/update_user';
  apiurl_create_user = environment.servers[environment.srv_mode].host + '/create_user';
  apiurl_user_activation = environment.servers[environment.srv_mode].host + '/user_activation';
  //
  apiurl_update_group = environment.servers[environment.srv_mode].host + '/update_group';
  apiurl_create_group = environment.servers[environment.srv_mode].host + '/create_group';
  apiurl_group_activation = environment.servers[environment.srv_mode].host + '/group_activation';
  //
  apiurl_vgroupsandusersstructure_get_item_by_id = environment.servers[environment.srv_mode].host + '/vgroupsandusersstructure_get_item_by_id';

  apiurl_vgroupsandusersstructure_get_items_by_parent_id = environment.servers[environment.srv_mode].host + '/vgroupsandusersstructure_get_items_by_parent_id';

  //from VGroups
  apiurl_vgroups_get_item_by_id = environment.servers[environment.srv_mode].host + '/vgroups_get_item_by_id';
  apiurl_vgroups_get_items_by_parent_id = environment.servers[environment.srv_mode].host + '/vgroups_get_items_by_parent_id';

  //from Users
  apiurl_vusers_get_item_by_id = environment.servers[environment.srv_mode].host + '/vusers_get_item_by_id';

  //groups member
  apiurl_groups_member = environment.servers[environment.srv_mode].host + '/groups_member';

  //load modal form for user edition
  apiurl_user_modal_form = environment.servers[environment.srv_mode].host + '/user_modal_form';
  apiurl_group_modal_form = environment.servers[environment.srv_mode].host + '/group_modal_form';
  //-----------Ontology--------------------------------------------
  apiurl_ventityStructure_get_items_by_parent_id = environment.servers[environment.srv_mode].host + '/ventityStructure_get_items_by_parent_id';
  apiurl_ontology_modal_form = environment.servers[environment.srv_mode].host + '/ontology_modal_form';
  apiurl_update_ontology = environment.servers[environment.srv_mode].host + '/update_ontology';
  apiurl_create_ontology = environment.servers[environment.srv_mode].host + '/create_ontology';
  apiurl_ontology_activation = environment.servers[environment.srv_mode].host + '/ontology_activation';
  apiurl_get_security_list = environment.servers[environment.srv_mode].host + '/get_security_list';
  apiurl_get_template_list_by_parent_id = environment.servers[environment.srv_mode].host + '/get_template_list_by_parent_id';
  apiurl_get_template_by_id = environment.servers[environment.srv_mode].host + '/get_template_by_id';
  apiurl_update_template_content = environment.servers[environment.srv_mode].host + '/update_template_content';
  //
  apiurl_custom_request = environment.servers[environment.srv_mode].host + '/custom_request';
  //------------
  apiurl_mstg_get_cstp_passport = environment.servers[environment.srv_mode].host + '/get_passport_cstp';
  apiurl_mstg_get_cstp_passport_by_id = environment.servers[environment.srv_mode].host + '/get_passport_cstp_by_id';
  apiurl_mstg_activation_cstp_passport = environment.servers[environment.srv_mode].host + '/passport_cstp_activation';
  //------------
  apiurl_get_type_targeted_list = environment.servers[environment.srv_mode].host + '/get_type_targeted_list';
  apiurl_get_targeted_list = environment.servers[environment.srv_mode].host + '/get_targeted_list';
  apiurl_vtechnology_passport_get_items_by_parent_id = environment.servers[environment.srv_mode].host + '/vtechnology_passport_get_items_by_parent_id';
  apiurl_create_passport_cstp = environment.servers[environment.srv_mode].host + '/create_passport_cstp';
  apiurl_update_passport_cstp = environment.servers[environment.srv_mode].host + '/update_passport_cstp';
  apiurl_create_tech_passport = environment.servers[environment.srv_mode].host + '/create_tech_passport';
  apiurl_update_tech_passport = environment.servers[environment.srv_mode].host + '/update_tech_passport';
  apiurl_get_tech_passport_template_by_id = environment.servers[environment.srv_mode].host + '/get_tech_pasport_template_by_id';
  apiurl_tech_passport_activation = environment.servers[environment.srv_mode].host + '/tech_passport_activation';
  apiurl_get_template_tech_passport_by_id = environment.servers[environment.srv_mode].host + '/get_template_tech_passport_by_id';
  apiurl_get_tech_passport_template_list_by_parent_id = environment.servers[environment.srv_mode].host + '/get_tech_passport_template_list_by_parent_id';
  //
  apiurl_create_targeted = environment.servers[environment.srv_mode].host + '/create_targeted';
  apiurl_remove_targeted = environment.servers[environment.srv_mode].host + '/remove_targeted';
  apiurl_get_registry_parent_id = environment.servers[environment.srv_mode].host + '/get_registry_by_parent_id';
  apiurl_create_registry = environment.servers[environment.srv_mode].host + '/create_registry';
  apiurl_create_registry_list = environment.servers[environment.srv_mode].host + '/create_registry_list';
  apiurl_remove_registry = environment.servers[environment.srv_mode].host + '/remove_registry';
  //
  apiurl_vtb_get_csv_list = environment.servers[environment.srv_mode].host + '/vtb_get_csv_list';
  apiurl_vtb_get_csv_by_id = environment.servers[environment.srv_mode].host + '/vtb_get_csv_by_id';
  apiurl_vtb_remove_csv = environment.servers[environment.srv_mode].host + '/vtb_remove_csv';
  apiurl_create_vtb_csv = environment.servers[environment.srv_mode].host + '/create_vtb_csv';
  apiurl_update_vtb_csv = environment.servers[environment.srv_mode].host + '/update_vtb_csv';
  apiurl_vtb_csv_modal_form = environment.servers[environment.srv_mode].host + '/csv_vtb_modal_form';
  //---Red_key---
  apiurl_red_key_get_vproject_list = environment.servers[environment.srv_mode].host + '/red_key_get_vproject_list';
  apiurl_red_key_get_project_by_id = environment.servers[environment.srv_mode].host + '/red_key_get_project_by_id';
  apiurl_red_key_activation_project = environment.servers[environment.srv_mode].host + '/red_key_activation_project';
  apiurl_redkey_get_calculations_by_parent_id = environment.servers[environment.srv_mode].host + '/redkey_get_calculations_by_parent_id';
  apiurl_redkey_get_calculations_by_id = environment.servers[environment.srv_mode].host + '/redkey_get_calculations_by_id';
  apiurl_redkey_get_modules_list = environment.servers[environment.srv_mode].host + '/redkey_get_modules_list';
  apiurl_redkey_create_calculation = environment.servers[environment.srv_mode].host + '/redkey_create_calculation';
  apiurl_redkey_remove_calculation = environment.servers[environment.srv_mode].host + '/redkey_remove_calculation';
  apiurl_redkey_update_calculation = environment.servers[environment.srv_mode].host + '/redkey_update_calculation';
  apiurl_redkey_create_project = environment.servers[environment.srv_mode].host + '/redkey_create_project';
  apiurl_redkey_update_project = environment.servers[environment.srv_mode].host + '/redkey_update_project';
  apiurl_redkey_launch_calc = environment.servers[environment.srv_mode].host + '/redkey_launch_calc';
  //--------------------------------------------------------------
  apiurl_get_files = environment.servers[environment.srv_mode].host + '/get_files';
  apiurl_add_file = environment.servers[environment.srv_mode].host + '/add_file';
  apiurl_delete_file = environment.servers[environment.srv_mode].host + '/delete_file';
  apiurl_download_file_ont = environment.servers[environment.srv_mode].host + '/download_file/';

  constructor(private http: HttpClient, private storageService: AuthenticationService) {}

  Login(L_credentials: any): Observable<any[]> {
    return this.http.post<any[]>(this.AUTH_API, L_credentials);
  }
  //---------------------------------------------------------------------------------------------------------------
  upload_file(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", file, file.name);
    formData.forEach((value, key) => {
      console.log(key + " " + value)
    });
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post(this.apiurl_upload_file, formData);
  }
  //---------------------------------------------------------------------------------------------------------------
  download_file(_name: string): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post(this.apiurl_download_file, { user: this.current_user, jwt: _token, filename: _name });
  }
  //---------------------------------------------------------------------------------------------------------------
  GetRootMenu(): Observable<VMenusOperations[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VMenusOperations[]>(this.apiurl_menu, { user: this.current_user, jwt: _token });
  }
  //---------------------------------------------------------------------------------------------------------------
  GetGroupsAndUsers(): Observable<VGroupsAndUsersStructureTree[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VGroupsAndUsersStructureTree[]>(this.apiurl_groups_and_users, { user: this.current_user, jwt: _token });
  }
  GetUsers(): Observable<VUsers> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VUsers>(this.apiurl_users, { user: this.current_user, jwt: _token });
  }
  /////////////////////////////
  UpdateUser(target_user: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_user, { target_user, user: this.current_user, jwt: _token });
  }
  CreateUser(target_user: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_user, { target_user, user: this.current_user, jwt: _token });
  }
  ActivationUser(target_user: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_user_activation, { target_user, user: this.current_user, jwt: _token });
  }
  //---------------------------
  get_group_modal_form(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_group_modal_form, { ID: _id, user: this.current_user, jwt: _token });
  }
  UpdateGroup(target_group: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_group, { target_group, user: this.current_user, jwt: _token });
  }
  CreateGroup(target_group: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_group, { target_group, user: this.current_user, jwt: _token });
  }
  ActivationGroup(target_group: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_group_activation, { target_group, user: this.current_user, jwt: _token });
  }
  //---------------------------
  VGroupsAndUsersStructure_get_item_by_id(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vgroupsandusersstructure_get_item_by_id, { ID: _id, user: this.current_user, jwt: _token });
  }
  VGroupsAndUsersStructure_get_items_by_parent_id(_parent_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vgroupsandusersstructure_get_items_by_parent_id, { Parent: _parent_id, user: this.current_user, jwt: _token });
  }
  //---------------------------
  VGroups_get_item_by_id(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vgroups_get_item_by_id, { ID: _id, user: this.current_user, jwt: _token });
  }
  VGroups_get_items_by_parent_id(_parent_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vgroups_get_items_by_parent_id, { Parent: _parent_id, user: this.current_user, jwt: _token });
  }
  //---------------------------
  VUsers_get_item_by_id(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vusers_get_item_by_id, { ID: _id, user: this.current_user, jwt: _token });
  }
  //---------------------------
  get_groups_member(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_groups_member, { ID: _id, user: this.current_user, jwt: _token });
  }
  //---------------------------
  get_user_modal_form(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_user_modal_form, { ID: _id, user: this.current_user, jwt: _token });
  }
  //---------------------------Ontology---------------------
  VEntityStructure_get_items_by_parent_id(_parent_id: any, _all_data: any, _entity_all_types: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_ventityStructure_get_items_by_parent_id, { Parent: _parent_id, all_data: _all_data, entity_all_types: _entity_all_types, user: this.current_user, jwt: _token });
  }
  //---------------------------
  get_ontology_modal_form(_id: any, _type: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_ontology_modal_form, { ID: _id, Type: _type, user: this.current_user, jwt: _token });
  }
  UpdateOntologyEntity(target_entity: any, _type: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_ontology, { target_entity, Type: _type, user: this.current_user, jwt: _token });
  }
  UpdateTemplateContent(_id: any, _open_content: any, _private_content: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_template_content, { ID: _id, open_content: _open_content, private_content: _private_content, user: this.current_user, jwt: _token });
  }
  CreateOntology(target_entity: any, _type: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_ontology, { target_entity, Type: _type, user: this.current_user, jwt: _token });
  }
  ActivationOntology(target_entity: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_ontology_activation, { target_entity, user: this.current_user, jwt: _token });
  }
  GetSecurityList(): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_security_list, { user: this.current_user, jwt: _token });
  }
  GetTemplateList(_id: any, _full_data: boolean): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_template_list_by_parent_id, { user: this.current_user, parent_id: _id, full_data: _full_data, jwt: _token });
  }
  GetTemplate(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_template_by_id, { user: this.current_user, id: _id, jwt: _token });
  }
  //---------------------------
  CustomRequest(_request: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_custom_request, { custom_request: _request, user: this.current_user, jwt: _token });
  }
  //---------------------------
  GetVPassportCSTPlist(): Observable<VPassportCSTP[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VPassportCSTP[]>(this.apiurl_mstg_get_cstp_passport, { user: this.current_user, jwt: _token });
  }
  GetPassportCSTPbyID(_id: any): Observable<PassportCSTP[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<PassportCSTP[]>(this.apiurl_mstg_get_cstp_passport_by_id, { user: this.current_user, jwt: _token, ID: _id });
  }
  ActivationPassportCSTP(target_entity: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_mstg_activation_cstp_passport, { target_entity, user: this.current_user, jwt: _token });
  }
  //-----------------------------------TechPassport--------------------------------------
  GetTypeTargetedList(): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_type_targeted_list, { user: this.current_user, jwt: _token });
  }
  GetTargetedList(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_targeted_list, { user: this.current_user, parent_id: _id, jwt: _token });
  }
  //-----------------------------------
  VTechnologyPassport_get_items_by_parent_id(_parent_id: any, _all_data: any, _entity_all_types: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vtechnology_passport_get_items_by_parent_id, { Parent: _parent_id, all_data: _all_data, entity_all_types: _entity_all_types, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  CreatePassportCstp(passport_cstp: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_passport_cstp, { passport_cstp, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  UpdatePassportCSTP(passport_cstp: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_passport_cstp, { passport: passport_cstp, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  CreateTechPasport(_tech_passport: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_tech_passport, { passport: _tech_passport, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  UpdateTechPasport(_tech_passport: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_tech_passport, { passport: _tech_passport, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  GetTechPassportTemplate(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_tech_passport_template_by_id, { user: this.current_user, id: _id, jwt: _token });
  }
  //-----------------------------------
  ActivationTechPassport(_passport: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_tech_passport_activation, { passport: _passport, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  GetTemplateTechPassport(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_template_tech_passport_by_id, { user: this.current_user, id: _id, jwt: _token });
  }
  //-----------------------------------
  GetTemplateListTechPassport(_id: any, _full_data: boolean): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_tech_passport_template_list_by_parent_id, { user: this.current_user, parent_id: _id, full_data: _full_data, jwt: _token });
  }
  //-----------------------------------
  CreateTargeted(_targeted: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_targeted, { targeted: _targeted, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  RemoveTargeted(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_remove_targeted, { ID: _id, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  GetListRegistry(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_get_registry_parent_id, { ID: _id, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  CreateRegistry(passport_cstp: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_registry, { passport_cstp, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  CreateRegistryList(_cstp_id: number, _passport_list: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_registry_list, { passport_list: _passport_list, cstp_id: _cstp_id, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  RemoveRegistry(_tech_id: number, _cstp_id: number): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_remove_registry, { tech_id: _tech_id, cstp_id: _cstp_id, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  GetVtbCsvList(_parent_id: number): Observable<VViewVTB[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VViewVTB[]>(this.apiurl_vtb_get_csv_list, { user: this.current_user, parent_id: _parent_id, jwt: _token });
  }
  //-----------------------------------
  GetVtbCsvById(_id: number): Observable<VViewVTB[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VViewVTB[]>(this.apiurl_vtb_get_csv_by_id, { user: this.current_user, id: _id, jwt: _token });
  }
  //-----------------------------------
  RemoveVtbCsv(_id: number): Observable<VViewVTB[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any[]>(this.apiurl_vtb_remove_csv, { user: this.current_user, id: _id, jwt: _token });
  }
  //-----------------------------------
  CreateVtbCsv(_item: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_create_vtb_csv, { item: _item, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  UpdateVtbCsv(_item: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_update_vtb_csv, { item: _item, user: this.current_user, jwt: _token });
  }
  //---vtb-csv modal form---------
  get_vtb_csv_modal_form(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_vtb_csv_modal_form, { ID: _id, user: this.current_user, jwt: _token });
  }
  //------Red key-------------------
  GetVProjectlist(): Observable<VPassportCSTP[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VPassportCSTP[]>(this.apiurl_red_key_get_vproject_list, { user: this.current_user, jwt: _token });
  }
  //-----------------------------------------------------
  RedKeyGetProjectById(_id: number): Observable<VPassportCSTP[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VPassportCSTP[]>(this.apiurl_red_key_get_project_by_id, { ID: _id, user: this.current_user, jwt: _token });
  }
  //------------------------------------------------------
  ActivationRedKeyProject(project: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_red_key_activation_project, { project, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  RedKeyUpdateProject(_item: any): Observable<VViewVTB[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any[]>(this.apiurl_redkey_update_project, { user: this.current_user, item: _item, jwt: _token });
  }
  //-----------------------------------
  RedKeyGetCalculations_by_parent_id(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_redkey_get_calculations_by_parent_id, { ID: _id, user: this.current_user, jwt: _token });
  }
  //------------------------------------------------------
  RedKeyGetCalculation_by_ID(_id: any): Observable<PassportCSTP[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<PassportCSTP[]>(this.apiurl_redkey_get_calculations_by_id, { user: this.current_user, jwt: _token, ID: _id });
  }
  //------------------------------------------------------
  RedKeyGetModulesList(): Observable<VModule[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<VModule[]>(this.apiurl_redkey_get_modules_list, { user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  RedKeyCreateCalculation(_item: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_redkey_create_calculation, { item: _item, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  RedKeyRemoveCalculation(_id: number): Observable<VViewVTB[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any[]>(this.apiurl_redkey_remove_calculation, { user: this.current_user, ID: _id, jwt: _token });
  }
  //-----------------------------------
  RedKeyUpdateCalculation(_item: any): Observable<VViewVTB[]> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any[]>(this.apiurl_redkey_update_calculation, { user: this.current_user, item: _item, jwt: _token });
  }
  //-----------------------------------
  RedKeyCreateProject(_item: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_redkey_create_project, { item: _item, user: this.current_user, jwt: _token });
  }
  //-----------------------------------
  RedKeyLaunchCalc(_id: any): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    return this.http.post<any>(this.apiurl_redkey_launch_calc, { ID: _id, user: this.current_user, jwt: _token });
  }
  /**
   * Получение списка файлов, связанных с сущностью
   * @param entityId Идентификатор сущности
   * @returns Observable с данными файлов и обновленным JWT токеном
   */
  getFiles(entityId: string): Observable<{ data: FileItem[], jwt: string }> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    const payload = {
      entityId: entityId,
      jwt: _token,
      user: this.current_user
    };
    return this.http.post<{ data: FileItem[], jwt: string }>(this.apiurl_get_files, payload);
  }
  /**
   * Загрузка нового файла и привязка его к сущности
   * @param entityId Идентификатор сущности
   * @param file Файл для загрузки
   * @param shortTitle Отображаемое имя файла
   * @returns Observable с результатом операции
   */
  addFile(entityId: string, file: File, shortTitle: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('entityId', entityId);
    formData.append('file', file, file.name);
    formData.append('shortTitle', shortTitle);
    formData.append('jwt', this.storageService.getToken() || '');
    formData.append('user', JSON.stringify(this.current_user));
  
    return this.http.post<any>(this.apiurl_add_file, formData);
  }
  /**
   * Удаление файла по его идентификатору
   * @param fileId Идентификатор файла
   * @returns Observable с результатом операции
   */
  deleteFile(fileId: string): Observable<any> {
    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();
    const payload = {
      fileId: fileId,
      jwt: _token,
      user: this.current_user
    };
    return this.http.post<any>(this.apiurl_delete_file, payload);
  }
  /**
   * Скачивание файла по его идентификатору
   * @param fileId Идентификатор файла
   * @returns Observable с Blob данными файла
   */
  downloadRedkeyFile(fileId: string): Observable<Blob> {
    this.current_user = this.storageService.getUser();
    const _token = this.storageService.getToken();
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    let params = new HttpParams().set('jwt', _token || '');

    console.log(params)
    
    return this.http.get(`${this.apiurl_redkey_download_file}${fileId}`, {
      headers: headers,
      params: params,
      responseType: 'blob'
    });
  }
  downloadFile(fileId: string): Observable<Blob> {
    this.current_user = this.storageService.getUser();
    const _token = this.storageService.getToken();
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    let params = new HttpParams().set('jwt', _token || '');

    console.log(params)
    
    return this.http.get(`${this.apiurl_download_file}${fileId}`, {
      headers: headers,
      params: params,
      responseType: 'blob'
    });
  }
  uploadFile(file: File, entityId: string, shortTitle: string): Observable<any> {
    return this.addFile(entityId, file, shortTitle);
  }
 
  downloadFileOnt(fileId: string): Observable<Blob> {
    return this.downloadFile(fileId);
  }

  uploadMainImage(entityId: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('entityId', entityId);
    formData.append('file', file, file.name);
    formData.append('jwt', this.storageService.getToken() || '');
    formData.append('user', JSON.stringify(this.current_user));
    return this.http.post<any>(this.apiurl_upload_main_image, formData);
  }

  downloadMainImage(filename: string): Observable<any> {
    return this.http.get<any>(this.apiurl_download_main_image + filename);
  }

  deleteMainImage(entityId: string, filename: string): Observable<any> {
    const payload = {
      entityId: entityId,
      filename: filename,
      jwt: this.storageService.getToken() || '',
      user: this.current_user
    };
    return this.http.post<any>(environment.servers[environment.srv_mode].host + '/delete_main_image', payload);
  }

  getFilesForModule(moduleName: string): Observable<{ data: FileItem[], jwt: string }> {
    console.log("Получен moduleName:", moduleName);

    this.current_user = this.storageService.getUser();
    let _token = this.storageService.getToken();

    const payload = {
      Module: moduleName, 
      jwt: _token,
      user: this.current_user
    };
    
    const url = environment.servers[environment.srv_mode].host + '/redkey_get_files_by_module';
    return this.http.post<{ data: FileItem[], jwt: string }>(url, payload);
}

  
    
}



