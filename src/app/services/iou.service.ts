import { Injectable } from "@angular/core";
import { HttpServer } from './http-server.service';
import { Server } from '../models/server';
import { Observable } from 'rxjs';
import { IouTemplate } from '../models/templates/iou-template';
import { IouImage } from '../models/iou/iou-image';

@Injectable()
export class IouService {
    constructor(private httpServer: HttpServer) {}

    getTemplates(server: Server): Observable<IouTemplate[]> {
        return this.httpServer.get<IouTemplate[]>(server, '/templates') as Observable<IouTemplate[]>;
    }

    getTemplate(server: Server, template_id: string): Observable<any> {
        return this.httpServer.get<IouTemplate>(server, `/templates/${template_id}`) as Observable<IouTemplate>;
    }

    getImages(server: Server): Observable<IouImage[]> {
        return this.httpServer.get<IouImage[]>(server, '/compute/iou/images') as Observable<IouImage[]>;
    }

    addTemplate(server: Server, iouTemplate: any): Observable<any> {
        return this.httpServer.post<IouTemplate>(server, `/templates`, iouTemplate) as Observable<IouTemplate>;
    }

    saveTemplate(server: Server, iouTemplate: any): Observable<any> {
        return this.httpServer.put<IouTemplate>(server, `/templates/${iouTemplate.template_id}`, iouTemplate) as Observable<IouTemplate>;

    }
}
