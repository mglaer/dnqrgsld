import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './home/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from '../material-module';
import { EditUserComponent } from './home/administration/modal/edit-user/edit-user.component';
import { AuthenticationService } from './services/authentication.service';
import { HomeComponent } from './home/home.component';
import { MenuItemComponent } from './home/menu-item/menu-item.component';
import { AdministrationRootComponent } from './home/administration/administration-root/administration-root.component';
import { GroupsComponent } from './home/administration/groups/groups.component';
import { UsersComponent } from './home/administration/users/users.component';
import { SidenavService } from './services/sidenav_service';
import { AngularSplitModule } from 'angular-split';
import { GroupsTableComponent } from './home/administration/groups-table/groups-table.component';
import { UsersTableComponent } from './home/administration/users-table/users-table.component';
import { JwtModule } from "@auth0/angular-jwt";
import { OntologiesRootComponent } from './home/ontologies/ontologies-root/ontologies-root.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { OntologyListComponent } from './home/ontologies/ontology-list/ontology-list.component';
import { CreateUserComponent } from './home/administration/modal/create-user/create-user.component';
import { CreateOntologyComponent } from './home/ontologies/modal/create-structure/create-structure.component';
import { EditOntologyComponent } from './home/ontologies/modal/edit-ontology/edit-ontology.component';
import { AdministrationListComponent } from './home/administration/administration-list/administration-list.component';
import { CreateGroupComponent } from './home/administration/modal/create-group/create-group.component';
import { EditGroupComponent } from './home/administration/modal/edit-group/edit-group.component';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { PanelWrapperComponent } from './home/ontologies/modal/panel-wrapper.component';
import { PanelHorizontalWrapperComponent } from './home/ontologies/modal/panel-horizontal-wrapper.component';
import { HeaderTemplateWrapperComponent } from './home/ontologies/modal/header-template-wrapper.component';
import { FormlyFieldTabs } from './home/ontologies/modal/tabs.type';
import { FileValueAccessor } from './home/ontologies/modal/file-value-accessor';
import { FormlyFieldFile } from './home/ontologies/modal/file-type.component';
import { RepeatTypeComponent } from './home/ontologies/modal/repeat-section.type';
import { CreateOntologyMasterComponent } from './home/ontologies/create-entity-master/create-entity-master.component';
import { NgChartsModule } from 'ng2-charts';

import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor';
import { CreateTemplateMasterComponent } from './home/ontologies/create-template/create-template.component';
import { EditEntityComponent } from './home/ontologies/edit-entity/edit-entity.component';
import { EditTemplateComponent } from './home/ontologies/edit-template/edit-template.component';
import { ImageUploadComponent } from './home/ontologies/modal/image-upload/image-upload.component';
import { CstpComponent } from './home/mstg/cstp/cstp.component';
import { TechnologyPassportComponent } from './home/mstg/technology-passport/technology-passport.component';
import { CstpCommonComponent } from './home/mstg/cstp/cstp-common/cstp-common.component';
import { CstpTargetCharacteristicsComponent } from './home/mstg/cstp/cstp-target-characteristics/cstp-target-characteristics.component';
import { CstpRegistryComponent } from './home/mstg/cstp/cstp-registry/cstp-registry.component';
import { CstpCreatePassportComponent } from './home/mstg/cstp/cstp-create-passport/cstp-create-passport.component';
import { TechnologyPassportListComponent } from './home/mstg/technology-passport/technology-passport-list/technology-passport-list.component';
import { TechnologyPassportCreateEntityComponent } from './home/mstg/technology-passport/technology-passport-create-entity/technology-passport-create-entity.component';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import localeDeExtra from '@angular/common/locales/extra/ru';
registerLocaleData(localeEn, 'en');
registerLocaleData(localeRu, 'ru', localeDeExtra);

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { HttpClient,HttpBackend } from '@angular/common/http';

import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { MbebComponent } from './home/mbeb/mbeb.component';
import { VmComponent } from './home/vm/vm.component';
import { ProjectMbebComponent } from './home/mbeb/project-mbeb/project-mbeb.component';
import { BoothWorkloadComponent } from './home/mbeb/booth-workload/booth-workload.component';
import { ProjectCdComponent } from './home/conceptual-design/project-cd/project-cd.component';
import { CvspComponent } from './home/vm/cvsp/cvsp.component';
import { ViewVtbComponent } from './home/virtual-test-bench/view-vtb/view-vtb.component';
import { CreateTemplateTechPassportComponent } from './home/mstg/technology-passport/create-template-tech-passport/create-template-tech-passport.component';
import { TechnologyPassportEditTemplateComponent } from './home/mstg/technology-passport/technology-passport-edit-template/technology-passport-edit-template.component';
import { TechnologyPassportEditEntityComponent } from './home/mstg/technology-passport/technology-passport-edit-entity/technology-passport-edit-entity.component';
import { AddTargetedComponent } from './home/mstg/cstp/add-targeted/add-targeted.component';
import { CstpEditPassportComponent } from './home/mstg/cstp/cstp-edit-passport/cstp-edit-passport.component';
import { AddRegistryComponent } from './home/mstg/cstp/add-registry/add-registry.component';
import { VtbListComponent } from './home/virtual-test-bench/vtb-list/vtb-list.component';
import { CsvListComponent } from './home/virtual-test-bench/csv-list/csv-list.component';
import { CsvViewerComponent } from './home/virtual-test-bench/csv-viewer/csv-viewer.component';
import { CreateVtbCsvComponent } from './home/virtual-test-bench/modal/create-vtb-csv/create-vtb-csv.component';
import { EditVtbCsvComponent } from './home/virtual-test-bench/modal/edit-vtb-csv/edit-vtb-csv.component';
import { RemoveConfirmComponent } from './home/virtual-test-bench/modal/remove-confirm/remove-confirm.component';
import { CalculationListComponent } from './home/conceptual-design/calculation-list/calculation-list.component';
import { CalRemoveConfirmComponent } from './home/conceptual-design/modal/cal-remove-confirm/cal-remove-confirm.component';
import { CalcViewComponent } from './home/conceptual-design/calc-view/calc-view.component';
import { CreateCalcMasterComponent } from './home/conceptual-design/create-calc-master/create-calc-master.component';
import { EditCalcComponent } from './home/conceptual-design/edit-calc/edit-calc.component';
import { RedkeyCreateProjectComponent } from './home/conceptual-design/modal/redkey-create-project/redkey-create-project.component';
import { ImageFullSizeComponent } from './home/ontologies/modal/image-full-size/image-full-size.component';
import { ProjectsMenuComponent } from './project-menu/project-menu.component';
import { ProjectCreateEditComponent } from './project-create-edit/project-create-edit.component';

//
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ProjectAddDialogComponent } from './home/mbeb/project-add-dialog/project-add-dialog.component';
import { ProjectEditDialogComponent } from './home/mbeb/project-edit-dialog/project-edit-dialog.component';
import { StageAddComponent } from './home/mbeb/stage-add/stage-add.component';
import { StagesComponent } from './home/mbeb/stages/stages.component';
import { EntityChoosingComponent } from './home/mbeb/entity-choosing/entity-choosing.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

export function HttpLoaderFactory(http: HttpBackend) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/general/', suffix: '.json' }
  ]);
}

//function is use to get jwt token from local storage
export function tokenGetter() {
  return localStorage.getItem("auth-token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    EditUserComponent,
    HomeComponent,
    MenuItemComponent,
    AdministrationRootComponent,
    GroupsComponent,
    UsersComponent,
    GroupsTableComponent,
    UsersTableComponent,
    OntologiesRootComponent,
    ErrorPageComponent,
    OntologyListComponent,
    ProjectsMenuComponent,
    ProjectCreateEditComponent,
    CreateUserComponent,
    CreateOntologyComponent,
    EditOntologyComponent,
    AdministrationListComponent,
    CreateGroupComponent,
    EditGroupComponent,
    FormlyFieldTabs,
    RepeatTypeComponent,
    CreateOntologyMasterComponent,
    CreateTemplateMasterComponent,
    EditEntityComponent,
    EditTemplateComponent,
    ImageUploadComponent,
    //
    FileValueAccessor,
    FormlyFieldFile,
    CstpComponent,
    TechnologyPassportComponent,
    CstpCommonComponent,
    CstpTargetCharacteristicsComponent,
    CstpRegistryComponent,
    CstpCreatePassportComponent,
    TechnologyPassportListComponent,
    TechnologyPassportCreateEntityComponent,
    MbebComponent,
    VmComponent,
    ProjectMbebComponent,
    BoothWorkloadComponent,
    ProjectCdComponent,
    CvspComponent,
    ViewVtbComponent,
    CreateTemplateTechPassportComponent,
    TechnologyPassportEditTemplateComponent,
    TechnologyPassportEditEntityComponent,
    AddTargetedComponent,
    CstpEditPassportComponent,
    AddRegistryComponent,
    VtbListComponent,
    CsvListComponent,
    CsvViewerComponent,
    CreateVtbCsvComponent,
    EditVtbCsvComponent,
    RemoveConfirmComponent,
    CalculationListComponent,
    CalRemoveConfirmComponent,
    CalcViewComponent,
    CreateCalcMasterComponent,
    EditCalcComponent,
    RedkeyCreateProjectComponent,
    ImageFullSizeComponent,
    ProjectEditDialogComponent,
    ProjectAddDialogComponent,
    StagesComponent,
    StageAddComponent,
    EntityChoosingComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    NgChartsModule,
    AngularSplitModule,
    HighchartsChartModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTooltipModule,
    JwtModule.forRoot(
      {//!!!
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:4200"],
          disallowedRoutes: []
        }
      }
    ),
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [{ name: 'required', message: 'This field is required' }],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'panel-horizontal', component: PanelHorizontalWrapperComponent },
        { name: 'panel-header', component: HeaderTemplateWrapperComponent },
      ],
      types: [{ name: 'tabs', component: FormlyFieldTabs },
      { name: 'repeat', component: RepeatTypeComponent },
      { name: 'string', extends: 'input' },
      { name: 'file', component: FormlyFieldFile, wrappers: ['form-field'] },
      ],
    }),
    AngJsoneditorModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    }),
    //AngularMyDatePickerModule,
  ],
  providers: [
    AuthenticationService,
    SidenavService,
    {
      provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ru']);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
