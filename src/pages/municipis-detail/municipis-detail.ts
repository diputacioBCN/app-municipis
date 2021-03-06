import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, FabContainer } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { TranslateService } from 'ng2-translate/ng2-translate'

import { PoisPage } from '../pois/pois';
import { ActivitiesPage } from '../activities/activities';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-municipi-detail',
  templateUrl: 'municipis-detail.html'
})

export class MunicipisDetailPage {
  private municipi: any;
  private favorite: boolean;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public userData: UserData,
    public translate: TranslateService, 
    public events: Events,
    public socialSharing: SocialSharing,
    public launchNavigator: LaunchNavigator
  ) {
      this.municipi = this.navParams.data.municipi;
  }

  ionViewDidLoad() {
    this.favorite = this.userData.hasFavoriteMunicipis(this.municipi.ine);
  }

  goToPois(index: string) {
    this.navCtrl.push(PoisPage, {
      ine: this.municipi.ine,
      name: this.municipi.municipi_nom
    });
  };

  goToActivities(index: string) {
    this.navCtrl.push(ActivitiesPage, {
      ine: this.municipi.ine,
      name: this.municipi.municipi_nom
    });
  };

	addFavorite() {
    let msg_added = '';
    this.translate.get('MUNICIPIS.FAVORITE_ADDED', {value: this.municipi.municipi_nom}).subscribe((res: string) => {
        msg_added = res;
    });
    let msg_ok = '';
    this.translate.get('APP.OK').subscribe((res: string) => {
        msg_ok = res;
    });
    this.userData.addFavoriteMunicipis(this.municipi.ine);
    let alert = this.alertCtrl.create({
      message: msg_added,
      buttons: [{
        text: msg_ok,
        handler: () => {
          this.favorite = true;
        }
      }]
    });
    alert.present();
  }

  removeFavorite() {
    let title = '';
    this.translate.get('MUNICIPIS.REMOVE_FAVORITE').subscribe((res: string) => {
      title = res;
    });
    let msg_remove_favorites = '';
    this.translate.get('MUNICIPIS.REMOVE_FAVORITES', {value: this.municipi.municipi_nom}).subscribe((res: string) => {
        msg_remove_favorites = res;
    });
    let msg_cancel = '';
    this.translate.get('APP.CANCEL').subscribe((res: string) => {
        msg_cancel = res;
    });
    let msg_remove = '';
    this.translate.get('MUNICIPIS.REMOVE').subscribe((res: string) => {
        msg_remove = res;
    });
    let alert = this.alertCtrl.create({
      title: title,
      message: msg_remove_favorites,
      buttons: [
        {
          text: msg_cancel
        },
        {
          text: msg_remove,
          handler: () => {
            this.userData.removeFavoriteMunicipis(this.municipi.ine);
            this.favorite = false;
            this.events.publish('MunicipiDetailPage:removeFavorite', this.municipi);
          }
        }
      ]
    });
    alert.present();
  }

  share(socialNet: string, fab: FabContainer) {
    if(socialNet == 'Twitter') {
      this.socialSharing.shareViaTwitter(this.municipi.municipi_nom, 
                                        this.municipi.municipi_vista, 
                                        this.municipi.grup_ajuntament.url_general);
    } else if(socialNet == 'Facebook') {
      this.socialSharing.shareViaFacebook(this.municipi.municipi_nom, 
                                        this.municipi.municipi_vista, 
                                        this.municipi.grup_ajuntament.url_general);
    } else if(socialNet == 'Whatsapp') {
      this.socialSharing.shareViaWhatsApp(this.municipi.municipi_nom, 
                                        this.municipi.municipi_vista, 
                                        this.municipi.grup_ajuntament.url_general);
    } else if(socialNet == 'Mail') {
      this.socialSharing.shareViaEmail(this.municipi.grup_ajuntament.adreca, this.municipi.municipi_nom, 
                                      [''],[''],[''],[this.municipi.municipi_vista]);
    }
    fab.close();
  }

  openMap() {
    this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS).then((isAvailable) => {
      var app;
      if (isAvailable) {
          app = this.launchNavigator.APP.GOOGLE_MAPS;
      } else {
          console.warn("Google Maps not available - falling back to user selection");
          app = this.launchNavigator.APP.USER_SELECT;
      }

      let options: LaunchNavigatorOptions = {
        app: app
      };

      this.launchNavigator.navigate(this.municipi.grup_ajuntament.localitzacio, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    }).catch((error) => {
      console.log('Error launching navigator', error);
    });
  }

  openMail(email) {
    window.open(`mailto:${email}`, '_system', 'location=yes');
  }

  openTel(telf) {
    window.open('tel:'+telf);
  }

  openLink(link) {
    window.open(`${link}`, '_system', 'location=yes');
  }
}
