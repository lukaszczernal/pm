import { Component, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import * as lf from 'lovefield';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  @ViewChild('backupBtn') backupBtn: ElementRef;
  @ViewChild('uploadDbInput') uploadDbInput: ElementRef;

  constructor(private db: DatabaseService) {}

  downloadDB(item) {
    this.db.export()
      .subscribe(json => {
            let blob = new Blob([json], {type: "octet/stream"});
            let url = window.URL.createObjectURL(blob);
            this.backupBtn.nativeElement.href = url;
            this.backupBtn.nativeElement.download = 'PM-DB-backup.json';
      });
  }

  readFile(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => this.populateDB(e.target.result);
      reader.readAsText(fileInput.target.files[0]);
    }
  }

  populateDB(jsonString: string) {
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      return 'String could not be parsed to JSON: ' + e;
    }

    Object.entries(data.tables)
      .forEach(([tableName, rows]) => this.db
        .update(tableName, rows).subscribe());

  }

}
