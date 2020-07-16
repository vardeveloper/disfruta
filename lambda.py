"""
Environment variables
---------------------

- QUEUE_NAME
- DATABASE_DSN
- ES_HOSTS
- PROMOTICK_API_LOGIN
- PROMOTICK_API_USER
- PROMOTICK_API_PASS
- PROMOTICK_API_BUSINESS_ID
- PROMOTICK_API_COUPONS
- PROMOTICK_API_CODES

"""
from promotick import PromotickSync

import json
import os
import logging

import boto3


SQS_QUEUE = boto3.resource('sqs').get_queue_by_name(
    QueueName=os.environ.get('QUEUE_NAME')
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


def handler(event, context):
    for _pending_action in event.get('Records', []):
        SQS_QUEUE.delete_messages(Entries=[{
            'Id': _pending_action.get('messageId'),
            'ReceiptHandle': _pending_action.get('receiptHandle')
        }])

        try:
            pending_action = json.loads(_pending_action.get('body'))
        except ValueError:
            continue

        logger.debug(pending_action)

        if pending_action.get('action', None) == 'promotick_sync':
            worker = PromotickSync()
            if worker.login():
                worker.sync()
        elif pending_action.get('action', None) == 'email':
            client = boto3.client('ses')
            body = {
                'Text': {
                    'Charset': 'UTF-8',
                    'Data': pending_action.get('text')
                }
            }
            if pending_action.get('html', None) is not None:
                body.update({
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': pending_action.get('html')
                    }
                })
            try:
                client.send_email(
                    Destination={
                        'ToAddresses': pending_action.get('to').split(',')
                    },
                    Message={
                        'Body': body,
                        'Subject': {
                            'Charset': 'UTF-8',
                            'Data': pending_action.get('subject')
                        }
                    },
                    Source=pending_action.get('from')
                )
            except:
                pass
