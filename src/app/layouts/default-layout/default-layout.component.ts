import { ElectronService } from 'ngx-electron';
import { Component, OnInit, ViewEncapsulation, OnDestroy, HostListener } from '@angular/core';
import { ServerManagementService } from '../../services/server-management.service';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { ProgressService } from '../../common/progress/progress.service';

@Component({
  selector: 'app-default-layout',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public isInstalledSoftwareAvailable = false;
  
  serverStatusSubscription: Subscription;
  shouldStopServersOnClosing = true;

  constructor(
    private electronService: ElectronService,
    private serverManagement: ServerManagementService,
    private toasterService: ToasterService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.isInstalledSoftwareAvailable = this.electronService.isElectronApp;

    // attach to notification stream when any of running local servers experienced issues
    this.serverStatusSubscription = this.serverManagement.serverStatusChanged.subscribe((serverStatus) => {
      if(serverStatus.status === 'errored') {
        this.toasterService.error(serverStatus.message);
      }
    });

    // stop servers only when in Electron
    this.shouldStopServersOnClosing = this.electronService.isElectronApp;
  }

  @HostListener('window:beforeunload', ['$event'])
  async onBeforeUnload($event) {
    if(!this.shouldStopServersOnClosing) {
      return;
    }
    $event.preventDefault()
    $event.returnValue = false;
    this.progressService.activate();
    await this.serverManagement.stopAll();
    this.shouldStopServersOnClosing = false;
    this.progressService.deactivate();
    window.close();
    return false;
  }

  ngOnDestroy() {
    this.serverStatusSubscription.unsubscribe();
  }

}
