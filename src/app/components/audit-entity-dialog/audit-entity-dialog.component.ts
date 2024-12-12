import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { JaversShadowDto } from '../../services/audit/audit.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-audit-entity-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogTitle, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './audit-entity-dialog.component.html',
  styleUrl: './audit-entity-dialog.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AuditEntityDialogComponent {
  data: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    actual: any;
    shadows: JaversShadowDto[];
  } = inject(MAT_DIALOG_DATA);

  expandedElementVersion = -1;

  columnsToDisplay = ['version', 'datetime', 'isInitial', 'changes', 'author'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
}
