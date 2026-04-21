in WorkflowsView and WorkflowDetailsView

1. Get Paginated Workflows
   GET /api/workflows
   searchParams: page: number; limit: number; status: draft, publish

2. Create workflow
   POST /api/workflows
   payload: {
     "name": "string",
     "description": "string",
     "status": "draft"
   }

3. Publish or Draft a workflow
   PATCH /api/workflows/status
   payload: {
     "id": "string",
     "status": "draft"
   }

4. Get Paginated Dispositions within workflow
   GET /api/workflow-dispositions
   searchParams: page: number; limit: number;

5. Update Disposition
   PATCH /api/workflow-dispositions
   payload: {
     "workflow_id": "string",
     "name": "string",
     "disposition_type": "no_answer",
     "resulting_lead_status": "cooldown",
     "max_attempts": 0,
     "cooldown_behavior": "default",
     "custom_cooldown_hours": 0,
     "custom_cooldown_min": 0,
     "max_attempt_reached": "completed",
     "keap_note": "string",
     "is_retry_allowed": false,
     "id": "123e4567-e89b-12d3-a456-426614174000"
   }

6. Create Disposition type
   POST /api/workflow-dispositions
   payload: {
     "workflow_id": "string",
     "name": "string",
     "disposition_type": "no_answer",
     "resulting_lead_status": "cooldown",
     "max_attempts": 0,
     "cooldown_behavior": "default",
     "custom_cooldown_hours": 0,
     "custom_cooldown_min": 0,
     "max_attempt_reached": "completed",
     "keap_note": "string",
     "is_retry_allowed": false
   }

7. Get Disposition Type
   GET /api/workflow-dispositions/get-remaining-disposition-type
   searchParams: id: string;

8. Get existing type
   GET /api/workflow-dispositions/get-existing-disposition-type
   searchParams: id: string;
