import elasticsearch_dsl
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import models
import settings

_db_conn = create_engine(settings.DATABASE_DSN, echo=settings.DEBUG)
elasticsearch_dsl.connections.create_connection(hosts=settings.ES_HOSTS)


def main():
    db = sessionmaker(bind=_db_conn)()
    gifts = db.query(
        models.BaseGift
    ).all()

    for gift in gifts:
        gift.es_save()

    db.close()


if __name__ == '__main__':
    main()
