import { useQuery, useMutation, useQueryClient, MutationFunction } from 'react-query';
import { Trash2, BookTemplate } from 'lucide-react';
import toast from 'react-hot-toast';
import { templatesApi } from '../services/api';

export default function TemplatesPage() {
  const queryClient = useQueryClient();
  const { data: templates, isLoading } = useQuery('templates', templatesApi.getAll);

  const mutFn: MutationFunction<void, string> = (id: string) => templatesApi.delete(id);
  const deleteMutation = useMutation<void, unknown, string>(mutFn, {
    onSuccess: () => { toast.success('Template deleted'); },
    onError: () => { toast.error('Failed to delete'); },
    onSettled: () => { queryClient.invalidateQueries('templates'); },
  });

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="topbar-title">Templates</span>
        </div>
      </div>

      <div className="page-wrapper">
        <div className="page-header">
          <h1 className="page-title">Template Library</h1>
          <p className="page-subtitle">
            Saved white pages you can use as a base for new generations
          </p>
        </div>

        {isLoading && (
          <div className="empty-state">
            <div className="spinner" />
          </div>
        )}

        {!isLoading && (!templates || templates.length === 0) && (
          <div className="empty-state card card-padding">
            <div className="empty-state-icon">
              <BookTemplate size={28} />
            </div>
            <div className="empty-state-title">No templates yet</div>
            <div className="empty-state-desc">
              Complete a task and save it as a template to build your library
            </div>
          </div>
        )}

        {templates && templates.length > 0 && (
          <div className="templates-grid">
            {templates.map((template) => (
              <div key={template.id} className="template-card">
                <div className="template-preview">
                  <div className="template-preview-lines">
                    <div className="preview-line medium" />
                    <div className="preview-line long" />
                    <div className="preview-line short" />
                    <div className="preview-line long" />
                    <div className="preview-line medium" />
                  </div>
                </div>
                <div className="template-info">
                  <div className="template-name">{template.name}</div>
                  <span className="niche-tag">{template.niche}</span>
                  {template.description && (
                    <p className="text-sm text-muted">{template.description}</p>
                  )}
                </div>
                <div className="template-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMutation.mutate(template.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
