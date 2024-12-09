import { CourseSearchCriteriaDto } from '@ivannicksim/vlp-backend-openapi-client';

export class EnumUtils {
  static formatDifficultyLevel(difficulyLevel: CourseSearchCriteriaDto.DifficultyLevelEnum): string {
    switch (difficulyLevel) {
      case CourseSearchCriteriaDto.DifficultyLevelEnum.Beginner:
        return 'Beginner';
      case CourseSearchCriteriaDto.DifficultyLevelEnum.Intermediate:
        return 'Intermediate';
      case CourseSearchCriteriaDto.DifficultyLevelEnum.Advanced:
        return 'Advanced';
      default:
        return difficulyLevel;
    }
  }

  static formatStatus(status: CourseSearchCriteriaDto.StatusEnum): string {
    switch (status) {
      case CourseSearchCriteriaDto.StatusEnum.Draft:
        return 'Draft';
      case CourseSearchCriteriaDto.StatusEnum.Published:
        return 'Published';
      default:
        return status;
    }
  }
}
