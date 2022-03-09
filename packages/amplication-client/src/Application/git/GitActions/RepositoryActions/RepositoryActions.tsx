import {
  Button,
  EnumButtonStyle,
  EnumPanelStyle,
  Icon,
  Panel,
} from "@amplication/design-system";
import React from "react";
import GithubSyncDetails from "./GithubSyncDetails";
import "../../AuthAppWithGit.scss";
import { GitRepositoryWithGitOrganization } from "../../SyncWithGithubPage";
import "./RepositoryActions.scss";
type Props = {
  onCreateRepository: () => void;
  onSelectRepository: () => void;
  currentConnectedGitRepository: GitRepositoryWithGitOrganization | null;
  isCreateShow: boolean;
};

const CLASS_NAME = "repository-actions";
export default function RepositoryActions({
  onCreateRepository,
  onSelectRepository,
  currentConnectedGitRepository,
  isCreateShow,
}: Props) {
  return (
    <div className={`${CLASS_NAME}`}>
      <Panel
        className={`${CLASS_NAME}__auth`}
        panelStyle={EnumPanelStyle.Bordered}
      >
        {currentConnectedGitRepository ? (
          <div>
            <GithubSyncDetails
              gitRepositoryWithOrganization={currentConnectedGitRepository}
            />
          </div>
        ) : (
          <div className={`${CLASS_NAME}__select-repo`}>
            <div className={`${CLASS_NAME}__select-repo__details`}>
              <Icon icon="info_circle" />
              No repository was selected
            </div>
            <div className={`${CLASS_NAME}__actions`}>
              <div className={`${CLASS_NAME}__action`}>
                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={onSelectRepository}
                  icon="chevron_down"
                >
                  Select repository
                </Button>
              </div>
              {isCreateShow && (
                <div className={`${CLASS_NAME}__action`}>
                  <Button
                    buttonStyle={EnumButtonStyle.Primary}
                    onClick={onCreateRepository}
                    icon="plus"
                  >
                    Create repository
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
