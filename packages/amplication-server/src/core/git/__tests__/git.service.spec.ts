import { Test, TestingModule } from '@nestjs/testing';
import { GitRepository } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { App } from 'src/models/App';
// import { EnumGitOrganizationType } from '../dto/enums/EnumGitOrganizationType';
import { EnumGitProvider } from '../dto/enums/EnumGitProvider';
// import { CreateGitRepositoryInput } from '../dto/inputs/CreateGitRepositoryInput';
import { RemoteGitRepositoriesWhereUniqueInput } from '../dto/inputs/RemoteGitRepositoriesWhereUniqueInput';
import { GitService } from '../git.service';
import { GitServiceFactory } from '../utils/GitServiceFactory/GitServiceFactory';
import { MOCK_GIT_SERVICE_FACTORY } from '../utils/GitServiceFactory/GitServiceFactory.mock';
import { TEST_GIT_REPOS } from '../__mocks__/GitRepos';

const EXAMPLE_GIT_REPOSITORY: GitRepository = {
  id: 'exampleGitRepositoryId',
  name: 'repositoryTest',
  appId: 'exampleAppId',
  gitOrganizationId: 'exampleGitOrganizationId',
  createdAt: new Date(),
  updatedAt: new Date()
};

const DEFAULT_APP_DATA = {
  color: 'DEFAULT_APP_COLOR'
};

const EXAMPLE_APP: App = {
  ...DEFAULT_APP_DATA,
  id: 'EXAMPLE_APP_ID',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'EXAMPLE_APP_NAME',
  description: 'EXAMPLE_APP_DESCRIPTION',
  deletedAt: null
};

const prismaGitRepositoryCreateMock = jest.fn(() => {
  return EXAMPLE_GIT_REPOSITORY;
});

const prismaAppCreateMock = jest.fn(() => {
  return EXAMPLE_APP;
});

const prismaGitRepositoryReturnEmptyMock = jest.fn(() => {
  return null;
});

describe('GitService', () => {
  let gitService: GitService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitService,
        {
          provide: PrismaService,
          useValue: {
            gitRepository: {
              create: prismaGitRepositoryCreateMock,
              findUnique: prismaGitRepositoryReturnEmptyMock
            },
            gitOrganization: {
              findUnique: prismaGitRepositoryCreateMock
            },
            app: {
              findUnique: prismaAppCreateMock
            }
          }
        },
        {
          provide: GitServiceFactory,
          useValue: MOCK_GIT_SERVICE_FACTORY
        }
      ]
    }).compile();

    gitService = module.get<GitService>(GitService);
  });

  it('should be defined', () => {
    expect(gitService).toBeDefined();
  });
  //#region github
  {
    describe('GitService.getReposOfOrganization()', () => {
      it('should return RemoteGitRepositories[]', async () => {
        const remoteGitRepositoriesWhereUniqueInput: RemoteGitRepositoriesWhereUniqueInput = {
          gitOrganizationId: 'exampleGitOrganizationId',
          gitProvider: EnumGitProvider.Github
        };
        const remoteGitRepositories = await gitService.getReposOfOrganization(
          remoteGitRepositoriesWhereUniqueInput
        );
        expect(remoteGitRepositories).toEqual(TEST_GIT_REPOS);
        expect(prismaGitRepositoryCreateMock).toBeCalledTimes(1);
      });
    });
    // describe('GitService.createRepo()', () => {
    //   it('should return App', async () => {
    //     const createGitRepositoryInput: CreateGitRepositoryInput = {
    //       name: 'EXAMPLE_APP_NAME',
    //       appId: 'EXAMPLE_APP_DESCRIPTION',
    //       gitOrganizationId: 'DEFAULT_APP_COLOR',
    //       gitProvider: EnumGitProvider.Github,
    //       public: true,
    //       gitOrganizationType: EnumGitOrganizationType.Organization
    //     };
    //     expect(
    //       await gitService.createGitRepository(createGitRepositoryInput)
    //     ).toEqual(EXAMPLE_APP);
    //     expect(prismaAppCreateMock).toBeCalledTimes(1);
    //   });
    // });
  }
  //#endregion
});
