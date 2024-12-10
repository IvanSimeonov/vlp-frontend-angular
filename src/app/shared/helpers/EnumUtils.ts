import { CourseSearchCriteriaDto, UserSearchCriteriaDto } from '@ivannicksim/vlp-backend-openapi-client';

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

  static formatUserRole(role: UserSearchCriteriaDto.RoleTypeEnum): string {
    switch (role) {
      case UserSearchCriteriaDto.RoleTypeEnum.Student:
        return 'Student';
      case UserSearchCriteriaDto.RoleTypeEnum.Teacher:
        return 'Teacher';
      case UserSearchCriteriaDto.RoleTypeEnum.Admin:
        return 'Admin';
      case UserSearchCriteriaDto.RoleTypeEnum.RootAdmin:
        return 'Root Admin';
      default:
        return role;
    }
  }

  static formatUserStatus(status: boolean) {
    return status ? 'Active' : 'Inactive';
  }
}
