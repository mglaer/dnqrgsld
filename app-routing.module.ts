import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdministrationRootComponent } from './home/administration/administration-root/administration-root.component';
import { GroupsComponent } from './home/administration/groups/groups.component';
import { UsersComponent } from './home/administration/users/users.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { OntologiesRootComponent } from './home/ontologies/ontologies-root/ontologies-root.component';
import { AuthGuard } from './guards';
import { CreateOntologyMasterComponent } from './home/ontologies/create-entity-master/create-entity-master.component';
import { CreateTemplateMasterComponent } from './home/ontologies/create-template/create-template.component';
import { EditTemplateComponent } from './home/ontologies/edit-template/edit-template.component';
import { EditEntityComponent } from './home/ontologies/edit-entity/edit-entity.component';

import { CstpComponent } from './home/mstg/cstp/cstp.component';
import { TechnologyPassportComponent } from './home/mstg/technology-passport/technology-passport.component';
import { TechnologyPassportCreateEntityComponent } from './home/mstg/technology-passport/technology-passport-create-entity/technology-passport-create-entity.component';
//import { TechnologyPassportCreateTemplateComponent } from './home/mstg/technology-passport/technology-passport-create-template/technology-passport-create-template.component';
//
import { CstpCommonComponent } from './home/mstg/cstp/cstp-common/cstp-common.component';
import { CstpTargetCharacteristicsComponent } from './home/mstg/cstp/cstp-target-characteristics/cstp-target-characteristics.component';
import { CstpRegistryComponent } from './home/mstg/cstp/cstp-registry/cstp-registry.component';
import { CstpCreatePassportComponent } from './home/mstg/cstp/cstp-create-passport/cstp-create-passport.component';
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
import { CstpEditPassportComponent } from './home/mstg/cstp/cstp-edit-passport/cstp-edit-passport.component';
import { AddRegistryComponent } from './home/mstg/cstp/add-registry/add-registry.component';
import { VtbListComponent } from './home/virtual-test-bench/vtb-list/vtb-list.component';
import { CsvViewerComponent } from './home/virtual-test-bench/csv-viewer/csv-viewer.component';
import { CalculationListComponent } from './home/conceptual-design/calculation-list/calculation-list.component';
import { CalcViewComponent } from './home/conceptual-design/calc-view/calc-view.component';
import { CreateCalcMasterComponent } from './home/conceptual-design/create-calc-master/create-calc-master.component';
import { EditCalcComponent } from './home/conceptual-design/edit-calc/edit-calc.component';
import { ProjectsMenuComponent } from './project-menu/project-menu.component';


const HomeRoutes: Routes = [
  { path: 'groups_users', component: AdministrationRootComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'ontologies_structure', component: OntologiesRootComponent, canActivate: [AuthGuard] },
  { path: 'create-entity-master', component: CreateOntologyMasterComponent, canActivate: [AuthGuard] },
  { path: 'create-template', component: CreateTemplateMasterComponent, canActivate: [AuthGuard] },
  { path: 'edit-template', component: EditTemplateComponent, canActivate: [AuthGuard] },
  { path: 'edit-entity', component: EditEntityComponent, canActivate: [AuthGuard] },
  //ntz
  { path: 'cstp', component: CstpComponent, canActivate: [AuthGuard] },
  { path: 'cstp-common', component: CstpCommonComponent, canActivate: [AuthGuard] },
  { path: 'cstp-registry', component: CstpRegistryComponent, canActivate: [AuthGuard] },
  { path: 'cstp-target-characteristics', component: CstpTargetCharacteristicsComponent, canActivate: [AuthGuard] },
  { path: 'cstp-create-passport', component: CstpCreatePassportComponent, canActivate: [AuthGuard] },
  { path: 'cstp-edit-passport', component: CstpEditPassportComponent, canActivate: [AuthGuard] },

  //passport
  { path: 'technology_passport', component: TechnologyPassportComponent, canActivate: [AuthGuard] },
  { path: 'technology_passport_create_entity', component: TechnologyPassportCreateEntityComponent, canActivate: [AuthGuard] },
  //{ path: 'technology_passport_create_template', component: TechnologyPassportCreateTemplateComponent, canActivate: [AuthGuard] },
  { path: 'create-template-tech-passport', component: CreateTemplateTechPassportComponent, canActivate: [AuthGuard] },
  { path: 'technology-passport-edit-template', component: TechnologyPassportEditTemplateComponent, canActivate: [AuthGuard] },
  { path: 'technology-passport-edit-entity', component: TechnologyPassportEditEntityComponent, canActivate: [AuthGuard] },
  { path: 'add-registry', component: AddRegistryComponent, canActivate: [AuthGuard] },
  
  //mbeb Управление стендовой экспериментальной базой
  { path: 'mbeb', component: MbebComponent, canActivate: [AuthGuard] },
  { path: 'project_mbeb', component: ProjectMbebComponent, canActivate: [AuthGuard] },
  { path: 'booth_workload', component: BoothWorkloadComponent, canActivate: [AuthGuard] },

  //conceptual_design Концептуальное моделирование
  { path: 'project_cd', component: ProjectCdComponent, canActivate: [AuthGuard] },
  //vm виртуальное моделирование
  { path: 'vm', component: VmComponent, canActivate: [AuthGuard] },
  //{ path: 'cvsp/:url', component: CvspComponent, canActivate: [AuthGuard] },
  { path: 'cvsp', component: CvspComponent, canActivate: [AuthGuard] },
  //virtual_test_bench Виртуальные испытательные стенды
  { path: 'view_vtb', component: ViewVtbComponent, canActivate: [AuthGuard] },
  { path: 'vtb_list', component: VtbListComponent, canActivate: [AuthGuard] },
  { path: 'csv-viewer', component: CsvViewerComponent, canActivate: [AuthGuard] },
  //RedKey
  { path: 'calculation_list', component: CalculationListComponent, canActivate: [AuthGuard] },
  { path: 'calc_view', component: CalcViewComponent, canActivate: [AuthGuard] },
  { path: 'create_calc_master', component: CreateCalcMasterComponent, canActivate: [AuthGuard] },
  { path: 'edit_calc', component: EditCalcComponent, canActivate: [AuthGuard] },


  { path: 'opredelenie-adh', component: ProjectsMenuComponent, canActivate: [AuthGuard]  }
];

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'error_page', component: ErrorPageComponent },
  { path: 'home', component: HomeComponent, children: HomeRoutes, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  
  { path: 'opredelenie-adh', component: ProjectsMenuComponent, canActivate: [AuthGuard]  },
  { path: '**', redirectTo: 'error_page' }
];




@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
