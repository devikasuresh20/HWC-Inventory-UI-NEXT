import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { FaciltyService } from './facilty.service';
import { ConfirmationService } from '../app-modules/core/services';
import { SetLanguageComponent } from '../app-modules/core/components/set-language.component';
import { LanguageService } from '../app-modules/core/services/language.service';


@Component({
  selector: 'app-facility-selection',
  templateUrl: './facility-selection.component.html',
  styleUrls: ['./facility-selection.component.css']
})
export class FacilitySelectionComponent implements OnInit, DoCheck {

  serviceProviderId: any;
  designation: any;
  stores: any = [];
  enableContinue = false;
  facilities: any = [];
  subFacilities: any = [];
  languageComponent!: SetLanguageComponent;
  currentLanguageSet: any;
  isMainStoreBool: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private faciltyService: FaciltyService,
    private http_service: LanguageService,
    private confirmationService: ConfirmationService,
  ) {}

  facilityForm = this.fb.group({
    isMainStore: '',
    facility: '',
    subFacility: '',
  });

  ngOnInit() {
    localStorage.removeItem('facilityDetail');
    localStorage.removeItem('facilityID');
    this.fetchLanguageResponse();
    this.serviceProviderId = localStorage.getItem('providerServiceID');
    this.getAllStores();
  }

  getAllStores() {
    this.faciltyService
      .getAllStores(this.serviceProviderId)
      .subscribe((data: any) => {
        this.stores = data.data;
      });
  }

  checkStores() {
    this.subFacilities = [];
    this.facilities = [];
    this.facilityForm.patchValue({
      facility: null,
      subFacility: null,
    });
    this.getFacility();
  }

  toContinue() {
    const isMainStore: any = this.facilityForm.controls['isMainStore'].value;
    const facility: any = this.facilityForm.controls['facility'].value;
    const subFacility: any = this.facilityForm.controls['subFacility'].value;
    if (
      this.facilityForm.controls.isMainStore.value &&
      this.facilityForm.controls.facility.value
    ) {
      this.enableContinue = true;
      localStorage.setItem('facilityID', facility.facilityID);
      localStorage.setItem('facilityDetail', JSON.stringify(facility));
    } else if (isMainStore == 'false' && facility && subFacility) {
      this.enableContinue = true;
      localStorage.setItem('facilityID', subFacility.facilityID);
      localStorage.setItem('facilityDetail', JSON.stringify(subFacility));
      this.getFacilityMappedVanID(subFacility.facilityID);
    } else {
      this.enableContinue = false;
    }
  }

  getFacility() {
    this.facilities = this.stores.filter((facility: any) => {
      if (facility.isMainFacility == true && facility.deleted == false) {
        return facility;
      }
    })
  }

  getSubFacility() {
    const facility: any = this.facilityForm.controls['facility'].value;
    this.facilityForm.patchValue({ subFacility: null });
    this.subFacilities = [];
    this.subFacilities = this.stores.filter((subFacility: any) => {
      if (!subFacility.deleted && subFacility.mainFacilityID && subFacility.mainFacilityID == facility.facilityID) {
        return subFacility;
      }
    })
  }

  vanID: any;
  parkingPlaceID: any;

  getFacilityMappedVanID(facilityID: any) {
    this.faciltyService.getVanByStoreID(facilityID)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data) {
          this.vanID = res.data.vanID;
          this.parkingPlaceID = res.data.parkingPlaceID;
        }
      });
  }

  checkSubFacility() {

  }

  proceedFurther() {
    this.designation = 'Pharmacist';
    if (this.vanID && this.parkingPlaceID) {
      localStorage.setItem('vanID', this.vanID);
      localStorage.setItem('parkingPlaceID', this.parkingPlaceID);
    }
    this.routeToDesignation(this.designation);
  }

  routeToDesignation(designation: any) {
    switch (designation) {
      case "Pharmacist":
        this.router.navigate(['/loadStores']);
        break;
      default:
    }
  }

  goToWorkList() {

  }

  //AN40085822 29/9/2021 Integrating Multilingual Functionality --Start--
  ngDoCheck(){
    this.fetchLanguageResponse();
  }

  fetchLanguageResponse() {
    this.languageComponent = new SetLanguageComponent(this.http_service);
    this.languageComponent.setLanguage();
    this.currentLanguageSet = this.languageComponent.currentLanguageObject; 
  }

  // getFacility() {
  //   this.facilities = this.stores.filter((facility: any) => {
  //     if (facility.isMainFacility == true && facility.deleted == false) {
  //       return facility;
  //     }
  //   });
  // }

  // getSubFacility() {
  //   const facility: any = this.facilityForm.controls['facility'].value;
  //   this.facilityForm.patchValue({ subFacility: null });
  //   this.subFacilities = [];
  //   this.subFacilities = this.stores.filter((subFacility: any) => {
  //     if (
  //       !subFacility.deleted &&
  //       subFacility.mainFacilityID &&
  //       subFacility.mainFacilityID == facility.facilityID
  //     ) {
  //       return subFacility;
  //     }
  //   });
  // }

  // vanID: any;
  // parkingPlaceID: any;

  // getFacilityMappedVanID(facilityID: any) {
  //   this.faciltyService.getVanByStoreID(facilityID).subscribe((res: any) => {
  //     if (res.statusCode == 200 && res.data) {
  //       this.vanID = res.data.vanID;
  //       this.parkingPlaceID = res.data.parkingPlaceID;
  //     }
  //   });
  // }
  // proceedFurther() {
  //   this.designation = 'Pharmacist';
  //   if (this.vanID && this.parkingPlaceID) {
  //     localStorage.setItem('vanID', this.vanID);
  //     localStorage.setItem('parkingPlaceID', this.parkingPlaceID);
  //   }
  //   this.routeToDesignation(this.designation);
  // }

  // routeToDesignation(designation: any) {
  //   switch (designation) {
  //     case 'Pharmacist':
  //       this.router.navigate(['/loadStores']);
  //       break;
  //     default:
  //   }
  // }

  // //AN40085822 29/9/2021 Integrating Multilingual Functionality --Start--
  // ngDoCheck() {
  //   this.fetchLanguageResponse();
  // }

  // fetchLanguageResponse() {
  //   this.languageComponent = new SetLanguageComponent(this.http_service);
  //   this.languageComponent.setLanguage();
  //   this.currentLanguageSet = this.languageComponent.currentLanguageObject;
  // }
}
