"""Add embedding column to cars

Revision ID: e66469cb0173
Revises: b57fe469ec4f
Create Date: 2025-07-23 17:28:06.429205

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import pgvector

# revision identifiers, used by Alembic.
revision: str = 'e66469cb0173'
down_revision: Union[str, Sequence[str], None] = 'b57fe469ec4f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('cars', sa.Column('embedding', pgvector.sqlalchemy.Vector(384), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('cars', 'embedding')
