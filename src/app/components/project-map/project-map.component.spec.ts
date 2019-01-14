import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMapComponent } from './project-map.component';
import { MatIconModule, MatToolbarModule, MatMenuModule, MatCheckboxModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerService } from '../../services/server.service';
import { ProjectService } from '../../services/project.service';
import { SettingsService } from '../../services/settings.service';
import { NodeService } from '../../services/node.service';
import { LinkService } from '../../services/link.service';
import { DrawingService } from '../../services/drawing.service';
import { ProgressService } from '../../common/progress/progress.service';
import { ProjectWebServiceHandler } from '../../handlers/project-web-service-handler';
import { MapChangeDetectorRef } from '../../cartography/services/map-change-detector-ref';
import { NodeWidget } from '../../cartography/widgets/node';
import { MapNodeToNodeConverter } from '../../cartography/converters/map/map-node-to-node-converter';
import { NodesDataSource } from '../../cartography/datasources/nodes-datasource';
import { LinksDataSource } from '../../cartography/datasources/links-datasource';
import { DrawingsDataSource } from '../../cartography/datasources/drawings-datasource';
import { CommonModule } from '@angular/common';
import { ANGULAR_MAP_DECLARATIONS } from '../../cartography/angular-map.imports';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockedSettingsService } from '../../services/settings.service.spec';
import { MockedServerService } from '../../services/server.service.spec';
import { MockedProjectService } from '../../services/project.service.spec';
import { Observable } from 'rxjs/Rx';
import { Drawing } from '../../cartography/models/drawing';
import { D3MapComponent } from '../../cartography/components/d3-map/d3-map.component';
import { of } from 'rxjs';
import { Server } from '../../models/server';
import { Node } from '../../cartography/models/node';
import { ToolsService } from '../../services/tools.service';
import { DrawingsWidget } from '../../cartography/widgets/drawings';
import { MapDrawingToDrawingConverter } from '../../cartography/converters/map/map-drawing-to-drawing-converter';

export class MockedProgressService {
  public activate() {}
}

export class MockedNodeService {
  public node = { label: {} } as Node;
  constructor() {}

  updateLabel(): Observable<Node> {
    return of(this.node);
  }

  updatePosition(): Observable<Node> {
    return of(this.node);
  }
}

export class MockedDrawingService {
  public drawing = {} as Drawing;
  constructor() {}

  add(_server: Server, _project_id:string, _x: number, _y:number, _svg: string) {
    return of(this.drawing);
  }

  updatePosition(_server: Server, _drawing: Drawing, _x: number, _y: number){
    return of(this.drawing);
  }

  updateSizeAndPosition(_server: Server, _drawing: Drawing, _x: number, _y: number, _svg: string){
    return of(this.drawing);
  }

  update(_server: Server, _drawing: Drawing){
    return of(this.drawing);
  }

  delete(_server: Server, _drawing: Drawing){
    return of(this.drawing);
  }

  updateText(_server: Server, _drawing: Drawing, _svg: string): Observable<Drawing> {
    return of(this.drawing);
  }
}

export class MockedLinkService {
  constructor() {}

  createLink() {
    return of({});
  }

  updateNodes(){
    return of({});
  }
}

export class MockedDrawingsDataSource {
  add() {}

  get() { return of({})}

  update() { return of({})}
}

export class MockedNodesDataSource {
  add() {}

  get() { return of({})}

  update() { return of({})}
}

describe('ProjectMapComponent', () => {
  let component: ProjectMapComponent;
  let fixture: ComponentFixture<ProjectMapComponent>;
  let drawingService = new MockedDrawingService;
  let drawingsDataSource = new MockedDrawingsDataSource;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatToolbarModule,
        MatMenuModule,
        MatCheckboxModule,
        CommonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ActivatedRoute },
        { provide: ServerService, useClass: MockedServerService },
        { provide: ProjectService, useClass: MockedProjectService },
        { provide: NodeService },
        { provide: LinkService },
        { provide: DrawingService, useValue: drawingService},
        { provide: ProgressService, useClass: MockedProgressService },
        { provide: ProjectWebServiceHandler },
        { provide: MapChangeDetectorRef },
        { provide: NodeWidget },
        { provide: DrawingsWidget },
        { provide: MapNodeToNodeConverter },
        { provide: MapDrawingToDrawingConverter },
        { provide: NodesDataSource },
        { provide: LinksDataSource },
        { provide: DrawingsDataSource, useValue: drawingsDataSource},
        { provide: SettingsService, useClass: MockedSettingsService },
        { provide: ToolsService }
      ],
      declarations: [
        ProjectMapComponent,
        D3MapComponent,
        ...ANGULAR_MAP_DECLARATIONS
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide draw tools when hide menu is called', () => {
    var dummyElement = document.createElement('map');
    document.getElementsByClassName = jasmine.createSpy('HTML element').and.callFake(() => { return ([dummyElement])});
    spyOn(component, 'resetDrawToolChoice');

    component.hideMenu();

    expect(component.resetDrawToolChoice).toHaveBeenCalled();
  });

  it('should reset choice on draw menu after saving drawing', () => {
    spyOn(component, 'resetDrawToolChoice');

    component.onDrawingSaved();

    expect(component.resetDrawToolChoice).toHaveBeenCalled();
  });
});
