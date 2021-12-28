import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CustomersComponent } from './components/customers/customers.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DepartmentComponent } from './components/department/department.component';
import { SubcategoriesComponent } from './components/subcategories/subcategories.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIziToastModule } from 'ngx-izitoast';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DialogConfirmComponent } from './dialogs/dialog-confirm/dialog-confirm.component';
import { DialogDepartmentComponent } from './dialogs/dialog-department/dialog-department.component';
import { DialogCategoryComponent } from './dialogs/dialog-category/dialog-category.component';
import { DialogSubcategoryComponent } from './dialogs/dialog-subcategory/dialog-subcategory.component';
import { DialogPhotoComponent } from './dialogs/dialog-photo/dialog-photo.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AdvertComponent } from './components/advert/advert.component';
import { Advert1Component } from './components/advert1/advert1.component';
import { Advert2Component } from './components/advert2/advert2.component';
import { ShipLocationComponent } from './components/ship-location/ship-location.component';
import { DialogLocationComponent } from './dialogs/dialog-location/dialog-location.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { DialogAdvertComponent } from './dialogs/dialog-advert/dialog-advert.component';
import { DialogInvoiceComponent } from './dialogs/dialog-invoice/dialog-invoice.component';
import { UniversalAppInterceptor } from './models/universal-app-interceptor';
import { JWTTokenService } from './models/jwttoken-service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    CategoriesComponent,
    CustomersComponent,
    OrdersComponent,
    AnalyticsComponent,
    DashboardComponent,
    DepartmentComponent,
    SubcategoriesComponent,
    ProductFormComponent,
    DialogConfirmComponent,
    DialogDepartmentComponent,
    DialogCategoryComponent,
    DialogSubcategoryComponent,
    DialogPhotoComponent,
    AdvertComponent,
    Advert1Component,
    Advert2Component,
    ShipLocationComponent,
    DialogLocationComponent,
    CartComponent,
    LoginComponent,
    DialogAdvertComponent,
    DialogInvoiceComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    DataTablesModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgxIziToastModule,
    ModalModule.forRoot(),
    LoggerModule.forRoot({
      level: !environment.production ? NgxLoggerLevel.LOG : NgxLoggerLevel.OFF,
      // serverLogLevel
      serverLogLevel: NgxLoggerLevel.OFF
      }),
    CKEditorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: UniversalAppInterceptor, multi: true },
    JWTTokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
 }
